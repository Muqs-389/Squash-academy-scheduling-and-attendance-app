
import { DEMO_MODE } from '../config';
import { UserProfile, Session, Booking, Announcement, UserRole, Tip } from '../types';

const RESETTABLE_KEYS = ['sessions', 'bookings', 'announcements', 'tips', 'user_profile'];

export const clearLocalDataStores = (extraKeys: string[] = []) => {
  const keysToClear = Array.from(new Set([...RESETTABLE_KEYS, ...extraKeys]));
  keysToClear.forEach((key) => localStorage.removeItem(`academy_${key}`));
  // Demo auth is stored outside the academy_* namespace
  localStorage.removeItem('demo_auth_user');
};

const MAX_CAPACITY = 7;

type StoredSession = {
  id: string;
  title: string;
  startISO: string;
  endISO: string;
  location: string;
  capacity: number;
  bookedCount: number;
  recurrence?: 'weekly' | 'none';
};

class ApiService {
  private currentUser: UserProfile | null = null;
  private authSubscribers: ((user: UserProfile | null) => void)[] = [];

  constructor() {
    if (DEMO_MODE) {
      const storedUser = localStorage.getItem('demo_auth_user');
      if (storedUser) this.currentUser = JSON.parse(storedUser);
    }
  }

  subscribeAuth(cb: (user: UserProfile | null) => void) {
    this.authSubscribers.push(cb);
    cb(this.currentUser);
    return () => this.authSubscribers = this.authSubscribers.filter(sub => sub !== cb);
  }

  async login(credentials: { role: UserRole; email?: string; password?: string; pin?: string; displayName?: string; children?: string[] }) {
    if (DEMO_MODE) {
      if (credentials.role === 'admin') {
        if (credentials.pin !== '7861') {
          throw new Error("Invalid Coach PIN. Access Denied.");
        }
      }

      const user: UserProfile = {
        uid: `u-${Date.now()}`,
        email: credentials.email || `${credentials.role}@muqssquash.com`,
        displayName: credentials.displayName || (credentials.role === 'admin' ? 'Coach Muq' : 'Parent User'),
        role: credentials.role,
        children: credentials.children || []
      };
      
      this.currentUser = user;
      localStorage.setItem('demo_auth_user', JSON.stringify(user));
      this.notifyAuth();
      return user;
    }
    throw new Error("Cloud auth required for production");
  }

  async updateChildren(children: string[]) {
    if (this.currentUser) {
      this.currentUser.children = children;
      localStorage.setItem('demo_auth_user', JSON.stringify(this.currentUser));
      this.notifyAuth();
    }
  }

  async logout() {
    this.currentUser = null;
    localStorage.removeItem('demo_auth_user');
    this.notifyAuth();
  }

  private notifyAuth() {
    this.authSubscribers.forEach(cb => cb(this.currentUser));
  }

  private getStore<T>(key: string, defaultVal: T): T {
    const stored = localStorage.getItem(`academy_${key}`);
    if (!stored) return defaultVal;
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error(`Unable to read ${key} store from localStorage`, error);
      throw new Error('Stored data is corrupted. Please reset app data.');
    }
  }

  private setStore(key: string, val: any) {
    localStorage.setItem(`academy_${key}`, JSON.stringify(val));
  }

  private normalizeDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return new Date(value);
    if (typeof value === 'string' || typeof value === 'number') {
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    if (typeof value === 'object' && typeof value.toDate === 'function') {
      const parsed = value.toDate();
      return parsed instanceof Date && !isNaN(parsed.getTime()) ? parsed : null;
    }
    return null;
  }

  private migrateSessions(raw: any[]): { sessions: StoredSession[]; invalidCount: number } {
    const migrated: StoredSession[] = [];
    let invalidCount = 0;

    raw.forEach((session) => {
      try {
        const startDate = this.normalizeDate(session?.startISO ?? session?.start);
        const endDate = this.normalizeDate(session?.endISO ?? session?.end ?? session?.start);

        if (!session?.id || !startDate || !endDate) {
          invalidCount++;
          return;
        }

        migrated.push({
          id: session.id,
          title: session.title ?? 'Session',
          startISO: startDate.toISOString(),
          endISO: endDate.toISOString(),
          location: session.location ?? 'Academy Court',
          capacity: session.capacity ?? MAX_CAPACITY,
          bookedCount: session.bookedCount ?? 0,
          recurrence: session.recurrence ?? 'none',
        });
      } catch (error) {
        console.error('Failed to migrate session record', session, error);
        invalidCount++;
      }
    });

    return { sessions: migrated, invalidCount };
  }

  private toRuntimeSession(session: StoredSession): Session {
    const { startISO, endISO, ...rest } = session;
    return {
      ...rest,
      start: { toDate: () => new Date(startISO) },
      end: { toDate: () => new Date(endISO) }
    } as Session;
  }

  private saveSessions(sessions: StoredSession[]) {
    this.setStore('sessions', sessions);
  }

  private getStoredSessions(): StoredSession[] {
    const raw = this.getStore<any[]>('sessions', []);
    const { sessions, invalidCount } = this.migrateSessions(raw);

    if (invalidCount > 0) {
      throw new Error('Some session data is corrupted. Please reset app data from Coach Control.');
    }

    return sessions;
  }

  async getSessions(): Promise<Session[]> {
    const sessions = this.getStoredSessions();
    if (sessions.length === 0) return [];
    return sessions.map((s) => this.toRuntimeSession(s));
  }

  async bookSession(session: Session, userId: string, playerName: string) {
    const sessions = this.getStoredSessions();
    const target = sessions.find(s => s.id === session.id);
    if (!target) throw new Error("Session vanished!");
    if (target.bookedCount >= MAX_CAPACITY) throw new Error("Court Roster is Full! (Max 7)");

    const allBookings = this.getStore<any[]>('bookings', []);
    if (allBookings.some(b => b.sessionId === session.id && b.playerName === playerName)) {
      throw new Error(`${playerName} is already on the roster!`);
    }

    target.bookedCount++;
    this.saveSessions(sessions);

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      sessionId: session.id,
      userId: userId,
      playerName: playerName,
      status: 'confirmed',
      sessionTitle: session.title,
      sessionDate: new Date(target.startISO),
      createdAt: new Date()
    };
    this.setStore('bookings', [...allBookings, newBooking]);
  }

  async cancelBooking(bookingId: string) {
    const allBookings = this.getStore<any[]>('bookings', []);
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;

    this.setStore('bookings', allBookings.filter(b => b.id !== bookingId));

    const sessions = this.getStoredSessions();
    const targetSession = sessions.find(s => s.id === booking.sessionId);
    if (targetSession) {
      targetSession.bookedCount = Math.max(0, targetSession.bookedCount - 1);
      this.saveSessions(sessions);
    }
  }

  async getBookings(userId: string): Promise<Booking[]> {
    const all = this.getStore<any[]>('bookings', []);
    return all.filter(b => b.userId === userId).map(b => ({
      ...b,
      createdAt: { toDate: () => new Date(b.createdAt) },
      sessionDate: { toDate: () => new Date(b.sessionDate) }
    }));
  }

  async getAnnouncements(): Promise<Announcement[]> {
    const items = this.getStore<any[]>('announcements', []);
    if (items.length === 0) return [];
    return items.map(i => ({ ...i, createdAt: { toDate: () => new Date(i.createdAt) } }));
  }

  async getTips(): Promise<Tip[]> {
    const items = this.getStore<any[]>('tips', []);
    if (items.length === 0) return [];
    return items.map(tip => ({ ...tip, createdAt: { toDate: () => new Date(tip.createdAt) } }));
  }

  async createSession(data: any) {
    const current = this.getStoredSessions();
    const startDate = this.normalizeDate(data.start);
    const endDate = this.normalizeDate(data.end);

    if (!startDate || !endDate) {
      throw new Error('Session times are invalid.');
    }

    const newItem: StoredSession = {
      id: `s-${Date.now()}`,
      title: data.title,
      location: data.location ?? 'Academy Court',
      capacity: data.capacity ?? MAX_CAPACITY,
      recurrence: data.recurrence ?? 'none',
      bookedCount: 0,
      startISO: startDate.toISOString(),
      endISO: endDate.toISOString(),
    };
    this.saveSessions([...current, newItem]);
  }

  async createAnnouncement(data: any) {
    const items = this.getStore<any[]>('announcements', []);
    const newItem = { ...data, id: `a-${Date.now()}`, createdAt: new Date(), readBy: [] };
    this.setStore('announcements', [newItem, ...items]);
  }

  async createTip(body: string, createdBy: string) {
    const items = this.getStore<any[]>('tips', []);
    const newItem: Tip = { id: `t-${Date.now()}`, body, createdAt: new Date(), createdBy };
    this.setStore('tips', [newItem, ...items]);
  }
}

export const api = new ApiService();


import { DEMO_MODE } from '../config';
import { UserProfile, Session, Booking, Announcement, UserRole } from '../types';
import { addDays, startOfToday, setHours, setMinutes, isSaturday, isSunday } from 'date-fns';

const MAX_CAPACITY = 7;

const generateInitialSessions = (): Session[] => {
  const sessions: Session[] = [];
  const today = startOfToday();

  for (let i = 0; i < 14; i++) {
    const currentDay = addDays(today, i);
    if (isSunday(currentDay)) continue;

    if (isSaturday(currentDay)) {
      sessions.push({
        id: `s-sat-kids-${i}`,
        title: 'Junior Academy (Sat)',
        start: { toDate: () => setHours(setMinutes(currentDay, 0), 10) },
        end: { toDate: () => setHours(setMinutes(currentDay, 0), 11) },
        location: 'Court 1',
        capacity: MAX_CAPACITY,
        bookedCount: 2,
      });
      sessions.push({
        id: `s-sat-adults-${i}`,
        title: 'Adult Performance (Sat)',
        start: { toDate: () => setHours(setMinutes(currentDay, 0), 11) },
        end: { toDate: () => setHours(setMinutes(currentDay, 0), 12) },
        location: 'Court 1',
        capacity: MAX_CAPACITY,
        bookedCount: 5,
      });
    } else {
      sessions.push({
        id: `s-mf-kids-${i}`,
        title: 'Junior Squad Training',
        start: { toDate: () => setHours(setMinutes(currentDay, 0), 16) },
        end: { toDate: () => setHours(setMinutes(currentDay, 30), 17) },
        location: 'Arena Court',
        capacity: MAX_CAPACITY,
        bookedCount: 3,
      });
      sessions.push({
        id: `s-mf-adults-${i}`,
        title: 'Adult Social Drill',
        start: { toDate: () => setHours(setMinutes(currentDay, 30), 17) },
        end: { toDate: () => setHours(setMinutes(currentDay, 30), 18) },
        location: 'Arena Court',
        capacity: MAX_CAPACITY,
        bookedCount: 1,
      });
    }
  }
  return sessions;
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
    return stored ? JSON.parse(stored) : defaultVal;
  }

  private setStore(key: string, val: any) {
    localStorage.setItem(`academy_${key}`, JSON.stringify(val));
  }

  async getSessions(): Promise<Session[]> {
    let sessions = this.getStore<any[]>('sessions', []);
    if (sessions.length === 0) {
      const initial = generateInitialSessions();
      const raw = initial.map(s => ({ ...s, start: s.start.toDate(), end: s.end.toDate() }));
      this.setStore('sessions', raw);
      sessions = raw;
    }
    return sessions.map(s => ({
      ...s,
      start: { toDate: () => new Date(s.start) },
      end: { toDate: () => new Date(s.end) }
    }));
  }

  async bookSession(session: Session, userId: string, playerName: string) {
    const sessions = await this.getSessions();
    const target = sessions.find(s => s.id === session.id);
    if (!target) throw new Error("Session vanished!");
    if (target.bookedCount >= MAX_CAPACITY) throw new Error("Court Roster is Full! (Max 7)");

    const allBookings = this.getStore<any[]>('bookings', []);
    if (allBookings.some(b => b.sessionId === session.id && b.playerName === playerName)) {
      throw new Error(`${playerName} is already on the roster!`);
    }

    target.bookedCount++;
    this.setStore('sessions', sessions);

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      sessionId: session.id,
      userId: userId,
      playerName: playerName,
      status: 'confirmed',
      sessionTitle: session.title,
      sessionDate: session.start.toDate(),
      createdAt: new Date()
    };
    this.setStore('bookings', [...allBookings, newBooking]);
  }

  async cancelBooking(bookingId: string) {
    const allBookings = this.getStore<any[]>('bookings', []);
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;

    this.setStore('bookings', allBookings.filter(b => b.id !== bookingId));

    const sessions = await this.getSessions();
    const targetSession = sessions.find(s => s.id === booking.sessionId);
    if (targetSession) {
      targetSession.bookedCount = Math.max(0, targetSession.bookedCount - 1);
      this.setStore('sessions', sessions);
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
    if (items.length === 0) {
      const welcome = {
        id: 'a1',
        title: 'Academy Relaunch!',
        body: 'Welcome to Muqs\' School of Squash. We are now strictly enforcing the 7-player roster limit. Book early!',
        createdAt: new Date(),
        createdBy: 'admin',
        readBy: []
      };
      this.setStore('announcements', [welcome]);
      return [{ ...welcome, createdAt: { toDate: () => welcome.createdAt } }];
    }
    return items.map(i => ({ ...i, createdAt: { toDate: () => new Date(i.createdAt) } }));
  }

  async createSession(data: any) {
    const current = await this.getSessions();
    const newItem = { 
      ...data, 
      id: `s-${Date.now()}`, 
      bookedCount: 0, 
      start: data.start.toDate(), 
      end: data.end.toDate() 
    };
    this.setStore('sessions', [...current, newItem]);
  }

  async createAnnouncement(data: any) {
    const items = this.getStore<any[]>('announcements', []);
    const newItem = { ...data, id: `a-${Date.now()}`, createdAt: new Date(), readBy: [] };
    this.setStore('announcements', [newItem, ...items]);
  }
}

export const api = new ApiService();

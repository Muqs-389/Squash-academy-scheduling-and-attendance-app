
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  query, 
  orderBy, 
  runTransaction,
  addDoc,
  deleteDoc,
  updateDoc,
  enableIndexedDbPersistence,
  where,
  Firestore
} from 'firebase/firestore';
import { User, Session, Booking, Announcement, UserRole, SessionType, Plan, AppConfig } from './types';

const firebaseConfig = {
  apiKey: "AIzaSyPlaceholder-Replace-This-With-Yours",
  authDomain: "muqs-squash-academy.firebaseapp.com",
  projectId: "muqs-squash-academy",
  storageBucket: "muqs-squash-academy.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Singleton initialization pattern for Firebase Services
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let initError: Error | null = null;

// Ensure initialization happens only once
const initFirebase = () => {
  if (app) return;
  
  try {
    // Check if firebase app is already initialized (HMR support)
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Initialize Auth and Firestore
    // Note: If using ESM with HMR, getAuth must reuse the app instance correctly.
    auth = getAuth(app);
    db = getFirestore(app);

    if (typeof window !== 'undefined') {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn("Persistence failed: multiple tabs open.");
        } else if (err.code === 'unimplemented') {
          console.warn("Persistence not supported by browser.");
        }
      });
    }
  } catch (error: any) {
    console.error("Firebase Initialization Error:", error);
    initError = error;
  }
};

export const MONTHLY_PLANS: Plan[] = [
  { id: 'p8', sessions: 8, price: 12000 },
  { id: 'p12', sessions: 12, price: 16000 },
  { id: 'p16', sessions: 16, price: 18000 },
  { id: 'p20', sessions: 20, price: 20000 },
  { id: 'p24', sessions: 24, price: 22000 },
];

class DataStore {
  private users: User[] = [];
  private sessions: Session[] = [];
  private bookings: Booking[] = [];
  private announcements: Announcement[] = [];
  private currentUser: User | null = null;
  private seenAnnouncementIds: string[] = [];
  private config: AppConfig = { academyName: "MUQS' SCHOOL OF SQUASH" };
  private subscribers: Set<() => void> = new Set();
  
  public isInitialized: boolean = false;
  public isAuthReady: boolean = false;
  public syncError: string | null = null;
  public firebaseUid: string | null = null;

  constructor() {
    initFirebase(); // Call init immediately on store creation
    
    if (initError) {
      this.syncError = `Startup Error: ${initError.message}`;
    } else if (auth) {
      this.setupAuth();
    } else {
      this.syncError = "Firebase failed to initialize (Unknown State)";
    }
    
    this.loadLocalCache();
  }

  private setupAuth() {
    // Start anonymous sign-in immediately to satisfy security rules
    signInAnonymously(auth).catch(err => {
      console.error("Auth Error:", err);
      // Clean up error message for display
      const msg = err.message || "Unknown error";
      this.syncError = `Authentication Failed: ${msg}`;
      this.notifySubscribers();
    });

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.firebaseUid = user.uid;
        this.isAuthReady = true;
        // Start Firestore listeners only AFTER auth is successful
        this.initListeners();
      } else {
        this.isAuthReady = false;
        // Don't show error on normal logout, only if we expected a session
        if (!this.currentUser) {
           this.syncError = null;
        }
      }
      this.notifySubscribers();
    });
  }

  private loadLocalCache() {
    try {
      const cachedUser = localStorage.getItem('muqs_current_user');
      if (cachedUser) {
        this.currentUser = JSON.parse(cachedUser);
      }
      const seen = localStorage.getItem('seen_announcements_muqs');
      if (seen) {
        this.seenAnnouncementIds = JSON.parse(seen);
      }
    } catch (e) {
      console.warn("Failed to load local cache", e);
    }
  }

  private async initListeners() {
    if (!this.isAuthReady || !db) return;

    const handleError = (error: any) => {
      console.error("Firestore sync error:", error);
      if (error.code === 'permission-denied') {
        this.syncError = "Cloud Access Denied: Authentication required.";
      } else {
        this.syncError = `Sync Error: ${error.message}`;
      }
      this.notifySubscribers();
    };

    onSnapshot(collection(db, 'sessions'), (snapshot) => {
      this.sessions = snapshot.docs.map(doc => ({ ...doc.data() as Session, id: doc.id }));
      this.notifySubscribers();
    }, handleError);

    onSnapshot(query(collection(db, 'announcements'), orderBy('createdAt', 'desc')), (snapshot) => {
      this.announcements = snapshot.docs.map(doc => ({ ...doc.data() as Announcement, id: doc.id }));
      this.notifySubscribers();
    }, handleError);

    onSnapshot(collection(db, 'bookings'), (snapshot) => {
      this.bookings = snapshot.docs.map(doc => ({ ...doc.data() as Booking, id: doc.id }));
      this.notifySubscribers();
    }, handleError);

    onSnapshot(collection(db, 'users'), (snapshot) => {
      this.users = snapshot.docs.map(doc => ({ ...doc.data() as User, id: doc.id }));
      if (this.currentUser) {
        const updated = this.users.find(u => u.id === this.currentUser?.id);
        if (updated) {
          this.currentUser = updated;
          localStorage.setItem('muqs_current_user', JSON.stringify(updated));
        }
      }
      this.notifySubscribers();
    }, handleError);

    onSnapshot(doc(db, 'settings', 'config'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        // Safety check to ensure we don't crash if data is malformed
        if (data && typeof data === 'object') {
          this.config = { ...this.config, ...data } as AppConfig;
        }
      }
      this.isInitialized = true;
      this.notifySubscribers();
    }, handleError);
  }

  subscribe(callback: () => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers() {
    this.subscribers.forEach(cb => cb());
  }

  async setCurrentUser(user: User | null) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('muqs_current_user', JSON.stringify(user));
      try {
        if (db) {
          await setDoc(doc(db, 'users', user.id), {
            ...user,
            updatedByUid: this.firebaseUid
          }, { merge: true });
        }
      } catch (e) {
        console.error("User Sync Error:", e);
      }
    } else {
      localStorage.removeItem('muqs_current_user');
    }
    this.notifySubscribers();
  }

  getCurrentUser() { return this.currentUser; }
  getUsers() { return this.users; }

  async updateUser(user: User) {
    try {
      if (db) {
        await updateDoc(doc(db, 'users', user.id), { 
          ...user,
          updatedByUid: this.firebaseUid
        });
      }
    } catch (e) {
      console.error("Update User Error:", e);
    }
  }

  getSessions() { return this.sessions; }
  
  async addSession(session: Session) {
    if (!db) return;
    const { id, ...data } = session;
    await addDoc(collection(db, 'sessions'), {
      ...data,
      createdByUid: this.firebaseUid
    });
  }

  async deleteSession(id: string) {
    if (!db) return;
    await deleteDoc(doc(db, 'sessions', id));
  }

  getBookings() { return this.bookings; }

  async addBooking(bookingData: Omit<Booking, 'id'>) {
    if (!db) return { success: false, error: "Database not initialized" };
    try {
      await runTransaction(db, async (transaction) => {
        const sessionDocRef = doc(db, 'sessions', bookingData.sessionId);
        const sessionSnap = await transaction.get(sessionDocRef);
        if (!sessionSnap.exists()) throw new Error("Session not found");
        
        const session = sessionSnap.data() as Session;
        const bookingsSnap = await transaction.get(query(
          collection(db, 'bookings'), 
          where('sessionId', '==', bookingData.sessionId),
          where('date', '>=', new Date().toISOString().split('T')[0]),
          where('status', '==', 'BOOKED')
        ));

        if (bookingsSnap.size >= session.capacity) {
          throw new Error("Session Full");
        }

        const newBookingRef = doc(collection(db, 'bookings'));
        transaction.set(newBookingRef, {
          ...bookingData,
          createdByUid: this.firebaseUid
        });
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async cancelBooking(id: string) {
    if (!db) return;
    await updateDoc(doc(db, 'bookings', id), { 
      status: 'CANCELLED',
      cancelledByUid: this.firebaseUid
    });
  }

  async toggleAttendance(id: string) {
    if (!db) return;
    const booking = this.bookings.find(b => b.id === id);
    if (booking) {
      await updateDoc(doc(db, 'bookings', id), { 
        attended: !booking.attended,
        attendanceToggledByUid: this.firebaseUid
      });
    }
  }

  getAnnouncements() { return this.announcements; }
  
  async addAnnouncement(announcement: Announcement) {
    if (!db) return;
    const { id, ...data } = announcement;
    await addDoc(collection(db, 'announcements'), {
      ...data,
      createdByUid: this.firebaseUid
    });
  }
  
  markAllAnnouncementsSeen() {
    const allIds = this.announcements.map(a => a.id);
    this.seenAnnouncementIds = Array.from(new Set([...this.seenAnnouncementIds, ...allIds]));
    localStorage.setItem('seen_announcements_muqs', JSON.stringify(this.seenAnnouncementIds));
    this.notifySubscribers();
  }

  getUnseenAnnouncementCount() {
    return this.announcements.filter(a => !this.seenAnnouncementIds.includes(a.id)).length;
  }
  
  isAnnouncementNew(id: string) {
    return !this.seenAnnouncementIds.includes(id);
  }

  getConfig() { return this.config; }
  
  async updateConfig(configUpdate: Partial<AppConfig>) {
    if (!db) return;
    await setDoc(doc(db, 'settings', 'config'), { 
      ...this.config, 
      ...configUpdate,
      updatedByUid: this.firebaseUid
    }, { merge: true });
  }
}

export const store = new DataStore();

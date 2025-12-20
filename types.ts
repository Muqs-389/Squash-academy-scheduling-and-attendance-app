
export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT'
}

export enum SessionType {
  JUNIOR = 'JUNIOR',
  ADULT = 'ADULT'
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  children?: ChildProfile[];
  activePlanId?: string;
  planPaid?: boolean;
  planStartDate?: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  skillLevel?: string;
}

export interface Plan {
  id: string;
  sessions: number;
  price: number;
}

export interface Session {
  id: string;
  name: string;
  type: SessionType;
  days: number[]; // 0-6 (Sun-Sat)
  startTime: string; // "HH:mm"
  endTime: string;
  capacity: number;
  price?: number; // Optional if covered by plan
  location?: string;
}

export interface Booking {
  id: string;
  sessionId: string;
  userId: string;
  childId?: string; // Optional if booking for a child
  date: string; // ISO String
  status: 'BOOKED' | 'CANCELLED';
  attended: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: 'ALL' | 'JUNIOR' | 'ADULT';
  createdAt: string;
  expiresAt?: string;
}

export interface AppConfig {
  customBackground?: string;
  academyName: string;
}

export type Screen = 'HOME' | 'SCHEDULE' | 'BOOKINGS' | 'ADMIN_DASHBOARD' | 'ADMIN_SESSIONS' | 'ADMIN_ANNOUNCEMENTS' | 'ADMIN_ATTENDANCE' | 'ADMIN_MEMBERS' | 'ADMIN_SETTINGS' | 'AUTH' | 'PROFILE' | 'PLANS' | 'ANNOUNCEMENTS';

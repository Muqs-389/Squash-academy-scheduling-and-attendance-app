
import React from 'react';

export type UserRole = 'admin' | 'parent';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  phone?: string;
  children: string[]; // List of child names
}

export interface Session {
  id: string;
  title: string;
  start: any; // Firestore Timestamp
  end: any;   // Firestore Timestamp
  location: string;
  capacity: number;
  bookedCount: number;
  recurrence?: 'weekly' | 'none';
}

export interface Booking {
  id: string;
  sessionId: string;
  userId: string;
  playerName: string; // Name of the child or parent playing
  userEmail?: string;
  userName?: string;
  createdAt: any;
  status: 'confirmed' | 'cancelled' | 'waitlist';
  sessionTitle?: string;
  sessionDate?: any;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  createdAt: any;
  createdBy: string;
  readBy: string[]; // array of user IDs
}

export interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

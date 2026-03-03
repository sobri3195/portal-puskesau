import { create } from 'zustand';
import type { UserProfile } from '@/shared/types';

interface AuthState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
}

const STORAGE_KEY = 'portal-auth-user';

const getStoredUser = (): UserProfile | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  setUser: (user) => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    set({ user });
  },
}));

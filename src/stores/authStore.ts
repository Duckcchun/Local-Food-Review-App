import { create } from 'zustand';
import type { UserInfo } from '../types';
import { projectId } from '../utils/supabase/info';

interface AuthState {
  userInfo: UserInfo | null;
  accessToken: string;
  isLoading: boolean;
  isSessionRestoring: boolean;

  // Actions
  setUserInfo: (userInfo: UserInfo | null) => void;
  setAccessToken: (token: string) => void;
  login: (userData: UserInfo, token: string) => void;
  logout: () => void;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  userInfo: null,
  accessToken: (() => {
    try {
      return localStorage.getItem('accessToken') || '';
    } catch {
      return '';
    }
  })(),
  isLoading: false,
  isSessionRestoring: false,

  setUserInfo: (userInfo) => set({ userInfo }),
  
  setAccessToken: (token) => {
    try {
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    } catch {}
    set({ accessToken: token });
  },

  login: (userData, token) => {
    try {
      if (token) localStorage.setItem('accessToken', token);
    } catch {}
    set({ userInfo: userData, accessToken: token });
  },

  logout: () => {
    try {
      localStorage.removeItem('accessToken');
    } catch {}
    set({ userInfo: null, accessToken: '' });
  },

  restoreSession: async () => {
    const { accessToken, userInfo } = get();
    if (!accessToken || userInfo) return;

    set({ isSessionRestoring: true });
    try {
      const resp = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-98b21042/profile`,
        {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );
      const data = await resp.json();
      if (resp.ok && data?.success && data.user) {
        const restored: UserInfo = {
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          userType: data.user.userType,
          businessName: data.user.businessName || undefined,
          businessNumber: data.user.businessNumber || undefined,
          businessAddress: data.user.businessAddress || undefined,
        };
        set({ userInfo: restored });
      } else {
        // invalid token
        try { localStorage.removeItem('accessToken'); } catch {}
        set({ accessToken: '' });
      }
    } catch {
      // Network failure – keep offline mode
    } finally {
      set({ isSessionRestoring: false });
    }
  },
}));

import { create } from 'zustand';
import type { UserInfo } from '../App';
import { projectId } from '../utils/supabase/info';

interface AuthState {
  userInfo: UserInfo | null;
  accessToken: string;
  isSessionRestoring: boolean;
  setUserInfo: (u: UserInfo | null) => void;
  setAccessToken: (t: string) => void;
  login: (u: UserInfo, t: string) => void;
  logout: () => void;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  userInfo: null,
  accessToken: (() => { try { return localStorage.getItem('accessToken') || ''; } catch { return ''; } })(),
  isSessionRestoring: false,

  setUserInfo: (userInfo) => set({ userInfo }),
  setAccessToken: (token) => {
    try { token ? localStorage.setItem('accessToken', token) : localStorage.removeItem('accessToken'); } catch {}
    set({ accessToken: token });
  },

  login: (userData, token) => {
    try { localStorage.setItem('accessToken', token); } catch {}
    set({ userInfo: userData, accessToken: token });
  },

  logout: () => {
    try { localStorage.removeItem('accessToken'); } catch {}
    set({ userInfo: null, accessToken: '' });
  },

  restoreSession: async () => {
    const { accessToken, userInfo } = get();
    if (!accessToken || userInfo) return;
    set({ isSessionRestoring: true });
    try {
      const resp = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98b21042/profile`, {
        method: 'GET', headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const data = await resp.json();
      if (resp.ok && data?.success && data.user) {
        set({ userInfo: { name: data.user.name, email: data.user.email, phone: data.user.phone, userType: data.user.userType, businessName: data.user.businessName, businessNumber: data.user.businessNumber, businessAddress: data.user.businessAddress } as UserInfo });
      } else {
        try { localStorage.removeItem('accessToken'); } catch {}
        set({ accessToken: '' });
      }
    } catch {}
    finally { set({ isSessionRestoring: false }); }
  },
}));

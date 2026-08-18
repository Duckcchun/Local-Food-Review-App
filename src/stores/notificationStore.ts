import { create } from 'zustand';
import type { Notification } from '../types';
import { notificationsApi } from '../utils/api';

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification, targetUserId?: string, accessToken?: string) => void;
  markAsRead: (id: string, accessToken?: string) => void;
  unreadCount: () => number;
  loadFromServer: (accessToken: string, userEmail?: string) => Promise<boolean>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  isLoading: false,

  setNotifications: (notifications) => set({ notifications }),

  addNotification: (notification, targetUserId, accessToken) => {
    const updated = [notification, ...get().notifications];
    set({ notifications: updated });
    // Backend save
    if (accessToken && targetUserId) {
      notificationsApi.create({ ...notification, targetUserId }, accessToken).catch(e =>
        console.log("Backend save failed:", e.message)
      );
    }
  },

  markAsRead: (id, accessToken) => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
    if (accessToken) {
      notificationsApi.markAsRead(id, accessToken).catch(e =>
        console.log("Backend save failed:", e.message)
      );
    }
  },

  unreadCount: () => get().notifications.filter(n => !n.read).length,

  loadFromServer: async (accessToken, userEmail) => {
    set({ isLoading: true });
    try {
      const data = await notificationsApi.getAll(accessToken);
      if (data.success) {
        const localKey = userEmail ? `notifications:${userEmail}` : 'notifications';
        const localNotifs: Notification[] = (() => {
          try { return JSON.parse(localStorage.getItem(localKey) || '[]'); } catch { return []; }
        })();
        const map = new Map<string, Notification>();
        for (const item of localNotifs) map.set(item.id, item);
        for (const item of (data.notifications ?? [])) map.set(item.id, item);
        const merged = Array.from(map.values());
        set({ notifications: merged });
        try { localStorage.setItem(localKey, JSON.stringify(merged)); } catch {}
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Failed to load notifications:', e);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));

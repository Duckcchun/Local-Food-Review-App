import { create } from 'zustand';
import type { Notification } from '../types';
import { notificationsApi } from '../utils/api';
import { toast } from 'sonner';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string, accessToken?: string) => void;

  // Business logic
  createNotification: (notification: Notification, targetUserId: string, accessToken?: string) => void;
  loadNotifications: (accessToken: string) => Promise<void>;
  initFromLocalStorage: (userEmail?: string) => void;
  persistToLocalStorage: (userEmail?: string) => void;
}

function localKey(key: string, email?: string) {
  const id = (email || '').trim();
  return id ? `${key}:${id}` : key;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => set({
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
  }),

  addNotification: (notification) => {
    set(state => {
      const updated = [notification, ...state.notifications];
      return {
        notifications: updated,
        unreadCount: updated.filter(n => !n.read).length,
      };
    });
  },

  markAsRead: (id, accessToken) => {
    set(state => {
      const updated = state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter(n => !n.read).length,
      };
    });

    if (accessToken) {
      notificationsApi.markAsRead(id, accessToken).catch(error => {
        console.log("Backend save failed (using localStorage):", (error as Error).message);
      });
    }
  },

  createNotification: (notification, targetUserId, accessToken) => {
    set(state => {
      const updated = [notification, ...state.notifications];
      return {
        notifications: updated,
        unreadCount: updated.filter(n => !n.read).length,
      };
    });

    if (accessToken) {
      notificationsApi.create({ ...notification, targetUserId }, accessToken).catch(error => {
        console.log("Backend save failed (using localStorage):", (error as Error).message);
      });
    }
  },

  loadNotifications: async (accessToken) => {
    try {
      const notifsData = await notificationsApi.getAll(accessToken);
      if (notifsData.success && notifsData.notifications) {
        const { notifications } = get();
        const map = new Map<string, Notification>();
        for (const item of notifications) map.set(item.id, item);
        for (const item of notifsData.notifications) map.set(item.id, item);
        const merged = Array.from(map.values());
        set({
          notifications: merged,
          unreadCount: merged.filter(n => !n.read).length,
        });
      }
    } catch (e) {
      console.warn('Failed to load notifications:', e);
    }
  },

  initFromLocalStorage: (userEmail) => {
    try {
      const saved = localStorage.getItem(localKey('notifications', userEmail));
      if (saved) {
        const notifications = JSON.parse(saved);
        set({
          notifications,
          unreadCount: notifications.filter((n: Notification) => !n.read).length,
        });
      }
    } catch { /* ignore */ }
  },

  persistToLocalStorage: (userEmail) => {
    const { notifications } = get();
    try {
      localStorage.setItem(localKey('notifications', userEmail), JSON.stringify(notifications));
    } catch { /* ignore */ }
  },
}));

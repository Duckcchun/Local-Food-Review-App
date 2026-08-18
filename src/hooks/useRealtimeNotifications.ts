import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import { toast } from 'sonner';
import {
  subscribeToNotifications,
  showBrowserNotification,
  requestNotificationPermission,
  getNotificationPermission,
  isAppFocused,
  type NotificationPermissionState,
} from '../utils/realtimeNotifications';
import type { Notification } from '../types';

/**
 * Hook that manages real-time notification subscriptions.
 *
 * Responsibilities:
 * 1. Subscribe to Supabase Realtime on login
 * 2. Unsubscribe on logout
 * 3. Update notification store on new events
 * 4. Show browser notification when app is in background
 * 5. Show toast when app is in foreground
 * 6. Request notification permission on first use
 */
export function useRealtimeNotifications() {
  const { userInfo, accessToken } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const permissionRequestedRef = useRef(false);

  // Request browser notification permission (once per session)
  const requestPermission = useCallback(async () => {
    if (permissionRequestedRef.current) return;
    permissionRequestedRef.current = true;

    const current = getNotificationPermission();
    if (current === 'default') {
      // Only ask after user has been using the app for a bit
      setTimeout(async () => {
        const result = await requestNotificationPermission();
        if (result === 'granted') {
          toast.success('🔔 알림이 활성화되었습니다');
        }
      }, 10000); // Ask after 10 seconds
    }
  }, []);

  // Handle incoming real-time notification
  const handleNewNotification = useCallback((payload: any) => {
    // Convert DB record to app Notification type
    const notification: Notification = {
      id: payload.id || `realtime-${Date.now()}`,
      type: payload.type || 'selection',
      title: payload.title || '새 알림',
      message: payload.message || '',
      productId: payload.product_id || payload.productId,
      productName: payload.product_name || payload.productName,
      productImage: payload.product_image || payload.productImage,
      createdAt: payload.created_at || new Date().toISOString(),
      read: false,
    };

    // Add to store
    addNotification(notification);

    // Show appropriate notification based on app focus state
    if (isAppFocused()) {
      // App is in foreground → show toast
      toast(notification.title, {
        description: notification.message,
        duration: 5000,
        action: notification.productName ? {
          label: '보기',
          onClick: () => {
            // Navigate to relevant page (handled by toast click)
            window.location.href = `/notifications`;
          },
        } : undefined,
      });
    } else {
      // App is in background → show browser notification
      showBrowserNotification(notification.title, {
        body: notification.message,
        tag: notification.id, // Prevent duplicates
        onClick: () => {
          window.location.href = '/notifications';
        },
      });
    }
  }, [addNotification]);

  // Subscribe/unsubscribe based on auth state
  useEffect(() => {
    if (userInfo?.email && accessToken) {
      // Subscribe to real-time notifications
      subscriptionRef.current = subscribeToNotifications(
        userInfo.email,
        accessToken,
        handleNewNotification
      );

      // Request browser notification permission
      requestPermission();
    }

    return () => {
      // Cleanup on unmount or auth change
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [userInfo?.email, accessToken, handleNewNotification, requestPermission]);
}

/**
 * Hook to get the notification permission status.
 * Useful for showing UI prompts to enable notifications.
 */
export function useNotificationPermission(): {
  permission: NotificationPermissionState;
  request: () => Promise<NotificationPermissionState>;
  isSupported: boolean;
} {
  const permission = getNotificationPermission();

  return {
    permission,
    request: requestNotificationPermission,
    isSupported: permission !== 'unsupported',
  };
}

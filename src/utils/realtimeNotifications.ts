/**
 * Supabase Realtime 알림 구독 및 브라우저 Notification API 연동.
 *
 * 동작 방식:
 * 1. Supabase Realtime 채널을 구독하여 DB INSERT 이벤트 수신
 * 2. 새 알림 수신 시 Zustand store 업데이트
 * 3. 브라우저 Notification API로 OS 레벨 알림 표시
 * 4. 앱이 포커스 상태이면 토스트만, 백그라운드이면 Push 알림
 */

import { projectId, publicAnonKey } from './supabase/info';

// ─── Browser Notification Permission ───────────────────────────────────────

export type NotificationPermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

/**
 * Check current browser notification permission state.
 */
export function getNotificationPermission(): NotificationPermissionState {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission as NotificationPermissionState;
}

/**
 * Request browser notification permission from the user.
 * Returns the new permission state.
 */
export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (!('Notification' in window)) return 'unsupported';
  
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';

  const result = await Notification.requestPermission();
  return result as NotificationPermissionState;
}

/**
 * Show a browser notification (OS-level).
 * Only works when permission is granted.
 */
export function showBrowserNotification(
  title: string,
  options?: {
    body?: string;
    icon?: string;
    tag?: string;
    onClick?: () => void;
  }
): Notification | null {
  if (getNotificationPermission() !== 'granted') return null;

  const notification = new Notification(title, {
    body: options?.body,
    icon: options?.icon || '/favicon.svg',
    tag: options?.tag, // Prevents duplicate notifications with same tag
    badge: '/favicon.svg',
  });

  if (options?.onClick) {
    notification.onclick = () => {
      window.focus();
      options.onClick?.();
      notification.close();
    };
  }

  // Auto-close after 5 seconds
  setTimeout(() => notification.close(), 5000);

  return notification;
}

// ─── Supabase Realtime Subscription ────────────────────────────────────────

interface RealtimeChannel {
  unsubscribe: () => void;
}

interface NotificationPayload {
  id: string;
  type: string;
  title: string;
  message: string;
  product_id?: string;
  product_name?: string;
  product_image?: string;
  target_user_id: string;
  created_at: string;
  read: boolean;
}

/**
 * Subscribe to real-time notifications for a specific user.
 * Uses Supabase Realtime (WebSocket) to listen for new notification inserts.
 *
 * Returns an unsubscribe function to call on cleanup.
 */
export function subscribeToNotifications(
  userId: string,
  accessToken: string,
  onNewNotification: (notification: NotificationPayload) => void
): RealtimeChannel {
  const wsUrl = `wss://${projectId}.supabase.co/realtime/v1/websocket?apikey=${publicAnonKey}&vsn=1.0.0`;

  let ws: WebSocket | null = null;
  let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  let isSubscribed = true;
  let ref = 0;

  const getRef = () => String(++ref);

  function connect() {
    if (!isSubscribed) return;

    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('[Realtime] Connected');

        // Join the notifications channel filtered by target user
        const joinMsg = {
          topic: `realtime:public:notifications:target_user_id=eq.${userId}`,
          event: 'phx_join',
          payload: {
            config: {
              broadcast: { self: false },
              postgres_changes: [
                {
                  event: 'INSERT',
                  schema: 'public',
                  table: 'notifications',
                  filter: `target_user_id=eq.${userId}`,
                },
              ],
            },
          },
          ref: getRef(),
        };

        ws?.send(JSON.stringify(joinMsg));

        // Start heartbeat
        heartbeatInterval = setInterval(() => {
          if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              topic: 'phoenix',
              event: 'heartbeat',
              payload: {},
              ref: getRef(),
            }));
          }
        }, 30000);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          // Handle postgres_changes INSERT events
          if (msg.event === 'postgres_changes' && msg.payload?.data?.record) {
            const record = msg.payload.data.record as NotificationPayload;
            onNewNotification(record);
          }

          // Also handle broadcast events (if using broadcast)
          if (msg.event === 'new_notification' && msg.payload) {
            onNewNotification(msg.payload as NotificationPayload);
          }
        } catch (e) {
          // Ignore parse errors for non-JSON messages
        }
      };

      ws.onclose = () => {
        console.log('[Realtime] Disconnected');
        cleanup();
        // Auto-reconnect after 3 seconds
        if (isSubscribed) {
          reconnectTimeout = setTimeout(connect, 3000);
        }
      };

      ws.onerror = (error) => {
        console.warn('[Realtime] WebSocket error:', error);
        ws?.close();
      };
    } catch (e) {
      console.warn('[Realtime] Connection failed:', e);
      if (isSubscribed) {
        reconnectTimeout = setTimeout(connect, 5000);
      }
    }
  }

  function cleanup() {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
  }

  // Start connection
  connect();

  // Return unsubscribe handle
  return {
    unsubscribe: () => {
      isSubscribed = false;
      cleanup();
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
      if (ws) {
        ws.close();
        ws = null;
      }
      console.log('[Realtime] Unsubscribed');
    },
  };
}

// ─── App Visibility Helper ─────────────────────────────────────────────────

/**
 * Check if the app/tab is currently in the foreground.
 */
export function isAppFocused(): boolean {
  return document.visibilityState === 'visible' && document.hasFocus();
}

/**
 * Listen for visibility changes (focus/blur).
 */
export function onVisibilityChange(callback: (isFocused: boolean) => void): () => void {
  const handler = () => callback(document.visibilityState === 'visible');
  document.addEventListener('visibilitychange', handler);
  window.addEventListener('focus', () => callback(true));
  window.addEventListener('blur', () => callback(false));

  return () => {
    document.removeEventListener('visibilitychange', handler);
    window.removeEventListener('focus', () => callback(true));
    window.removeEventListener('blur', () => callback(false));
  };
}

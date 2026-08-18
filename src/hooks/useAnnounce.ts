import { useState, useCallback } from 'react';

/**
 * Hook for programmatic screen reader announcements.
 *
 * Returns:
 * - `announce(message)` — triggers a screen reader announcement
 * - `message` — current message (pass to <LiveRegion />)
 *
 * Usage:
 * ```tsx
 * const { message, announce } = useAnnounce();
 * // After some action:
 * announce('체험단 신청이 완료되었습니다');
 * // In JSX:
 * <LiveRegion message={message} />
 * ```
 */
export function useAnnounce() {
  const [message, setMessage] = useState('');

  const announce = useCallback((text: string) => {
    setMessage(''); // Reset first to handle repeated messages
    setTimeout(() => setMessage(text), 50);
  }, []);

  return { message, announce };
}

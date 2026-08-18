import { useState, useEffect } from 'react';

interface LiveRegionProps {
  /** The message to announce. Change this to trigger an announcement. */
  message: string;
  /** Politeness level: 'polite' waits for user idle, 'assertive' interrupts */
  politeness?: 'polite' | 'assertive';
}

/**
 * ARIA Live Region for dynamic announcements to screen readers.
 *
 * Usage:
 * - Pass a new `message` string when you want to announce something.
 * - The message is visually hidden but announced by screen readers.
 *
 * Common uses:
 * - "3개의 검색 결과" (after filtering)
 * - "체험단 신청이 완료되었습니다" (after action)
 * - "페이지가 로드되었습니다" (after navigation)
 */
export function LiveRegion({ message, politeness = 'polite' }: LiveRegionProps) {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (message) {
      // Clear then set to force re-announcement of same message
      setAnnouncement('');
      const timer = setTimeout(() => setAnnouncement(message), 100);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}

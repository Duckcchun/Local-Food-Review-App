/**
 * Skip to main content link.
 * Visible only when focused (keyboard navigation).
 * Allows screen reader / keyboard users to bypass navigation.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-gray-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-white"
    >
      본문으로 건너뛰기
    </a>
  );
}

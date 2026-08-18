/**
 * Skeleton loading component displayed while lazy-loaded pages are being fetched.
 * Mimics typical page layout with animated placeholder blocks.
 */
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#fffef5] animate-pulse">
      {/* Header skeleton */}
      <div className="bg-gradient-to-br from-[#6b8e6f] to-[#8fa893] pt-8 pb-16">
        <div className="max-w-md mx-auto px-6">
          <div className="h-6 w-20 bg-white/30 rounded mb-6" />
          <div className="h-8 w-32 bg-white/30 rounded mb-3" />
          <div className="h-4 w-48 bg-white/20 rounded" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-md mx-auto px-6 -mt-8 space-y-4">
        <div className="bg-white rounded-2xl p-6 border-2 border-[#d4c5a0]/30 shadow-sm">
          <div className="h-5 w-3/4 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-full bg-gray-100 rounded mb-2" />
          <div className="h-4 w-5/6 bg-gray-100 rounded mb-2" />
          <div className="h-4 w-2/3 bg-gray-100 rounded" />
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-[#d4c5a0]/30 shadow-sm">
          <div className="h-40 w-full bg-gray-200 rounded-xl mb-4" />
          <div className="h-5 w-1/2 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-100 rounded" />
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-[#d4c5a0]/30 shadow-sm">
          <div className="h-40 w-full bg-gray-200 rounded-xl mb-4" />
          <div className="h-5 w-1/2 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * Card-level skeleton for lists (e.g., product cards in a feed)
 */
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-[#d4c5a0]/30 shadow-sm animate-pulse">
      <div className="h-40 w-full bg-gray-200 rounded-xl mb-3" />
      <div className="h-5 w-2/3 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-1/2 bg-gray-100 rounded mb-2" />
      <div className="flex gap-2 mt-3">
        <div className="h-6 w-16 bg-gray-100 rounded-full" />
        <div className="h-6 w-16 bg-gray-100 rounded-full" />
        <div className="h-6 w-16 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Inline skeleton for smaller UI sections (e.g., a stat number)
 */
export function InlineSkeleton({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-block bg-gray-200 rounded animate-pulse ${className}`} />
  );
}

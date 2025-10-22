export default function Loading() {
  return (
    <div className="transactions animate-pulse">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>

        {/* Account card skeleton */}
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <div className="h-6 bg-blue-400/50 rounded w-48"></div>
            <div className="h-4 bg-blue-400/50 rounded w-64"></div>
            <div className="h-4 bg-blue-400/50 rounded w-40"></div>
          </div>
          <div className="transactions-account-balance">
            <div className="h-4 bg-blue-400/50 rounded w-32 mb-2"></div>
            <div className="h-8 bg-blue-400/50 rounded w-24"></div>
          </div>
        </div>

        {/* Table skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

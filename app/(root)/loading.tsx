export default function Loading() {
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          {/* Header skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>

          {/* Balance box skeleton */}
          <div className="total-balance animate-pulse">
            <div className="total-balance-chart">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-8 bg-gray-200 rounded w-40"></div>
            </div>
          </div>
        </header>

        {/* Recent transactions skeleton */}
        <div className="recent-transactions">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar skeleton */}
      <aside className="right-sidebar animate-pulse">
        <div className="profile-banner bg-gray-200"></div>
        <div className="space-y-4 mt-16">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </aside>
    </section>
  )
}

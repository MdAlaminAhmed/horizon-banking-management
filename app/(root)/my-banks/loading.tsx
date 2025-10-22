export default function Loading() {
  return (
    <div className="my-banks animate-pulse">
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>

        {/* Cards grid skeleton */}
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[190px] bg-gray-200 rounded-[20px]"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

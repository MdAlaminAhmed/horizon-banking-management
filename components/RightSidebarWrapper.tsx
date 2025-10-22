import { Suspense } from 'react'
import { getAccounts } from '@/lib/actions/bank.actions'
import RightSidebar from './RightSidebar'

// Skeleton component for sidebar
function RightSidebarSkeleton() {
  return (
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8 -mx-6">
        <div className="profile-banner" />
        <div className="profile px-6">
          <div className="profile-img">
            <div className="w-full h-full rounded-full bg-gray-200 animate-pulse" />
          </div>
          <div className="profile-details">
            <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
        </div>
      </section>

      <section className="banks">
        <div className="flex w-full justify-between items-center mb-5">
          <div className="h-7 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center gap-5 mb-8">
          <div className="w-full h-48 bg-gray-200 rounded-xl animate-pulse" />
        </div>

        <div className="flex flex-col gap-6 bg-gray-50 rounded-xl p-6 -mx-6 px-6">
          <div className="flex justify-between items-center">
            <div className="h-7 bg-gray-200 rounded w-32 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-5 animate-pulse" />
          </div>
          <div className="space-y-5">
            <div className="h-16 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-16 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-16 bg-gray-200 rounded w-full animate-pulse" />
          </div>
        </div>
      </section>
    </aside>
  )
}

// Async component that fetches data
async function RightSidebarData({ user }: { user: any }) {
  try {
    const accountsData = await getAccounts({ 
      userId: user.$id 
    })

    return (
      <RightSidebar 
        user={user}
        transactions={[]}
        banks={accountsData?.data || []}
      />
    )
  } catch (error) {
    console.error('Error loading sidebar data:', error)
    // Return sidebar with no banks on error
    return (
      <RightSidebar 
        user={user}
        transactions={[]}
        banks={[]}
      />
    )
  }
}

// Wrapper component with Suspense boundary
export default function RightSidebarWrapper({ user }: { user: any }) {
  if (!user) {
    return (
      <RightSidebar 
        user={user}
        transactions={[]}
        banks={[]}
      />
    )
  }

  return (
    <Suspense fallback={<RightSidebarSkeleton />}>
      <RightSidebarData user={user} />
    </Suspense>
  )
}

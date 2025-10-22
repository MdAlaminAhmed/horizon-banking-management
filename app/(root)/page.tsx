import { Suspense } from 'react'
import HeaderBox from '@/components/HeaderBox'
import AccountsWrapper from '@/components/AccountsWrapper'
import TransactionsWrapper from '@/components/TransactionsWrapper'
import RightSidebarWrapper from '@/components/RightSidebarWrapper'
import { getLoggedInUser } from '@/lib/actions/user.actions'

// ⚡ PERFORMANCE: Optimize for fastest possible load
export const dynamic = 'force-dynamic' // Always fetch fresh data for financial data

const Home = async ({ searchParams: { page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1

  // ⚡ INSTANT LOAD: Only fetch user for header, everything else loads via Suspense
  const loggedIn = await getLoggedInUser().catch(() => null)

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          {/* ⚡ Loads with Suspense - shows skeleton instantly */}
          <AccountsWrapper userId={loggedIn?.$id || null} user={loggedIn} />
        </header>

        {/* ⚡ Loads with Suspense - shows skeleton instantly */}
        <TransactionsWrapper userId={loggedIn?.$id || null} page={currentPage} />
      </div>

      {/* ⚡ Loads with Suspense - shows skeleton instantly */}
      <RightSidebarWrapper user={loggedIn} />
    </section>
  )
}

export default Home
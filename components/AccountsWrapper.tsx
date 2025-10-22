import { Suspense } from 'react'
import { getAccounts } from '@/lib/actions/bank.actions'
import TotalBalanceBox from './TotalBalanceBox'

async function AccountsData({ userId, user }: { userId: string; user: any }) {
  const accountsRes = await getAccounts({ userId })
  
  const accounts = accountsRes?.data || []
  const totalBanks = accounts.length
  const totalCurrentBalance = accounts.reduce((s: number, a: any) => s + (Number(a?.currentBalance) || 0), 0)

  return (
    <TotalBalanceBox
      accounts={accounts}
      totalBanks={totalBanks}
      totalCurrentBalance={totalCurrentBalance}
      user={user}
    />
  )
}

function AccountsSkeleton() {
  return (
    <div className="total-balance animate-pulse">
      <div className="total-balance-chart">
        <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-8 bg-gray-200 rounded w-40"></div>
      </div>
    </div>
  )
}

export default function AccountsWrapper({ userId, user }: { userId: string | null; user: any }) {
  if (!userId) {
    return (
      <TotalBalanceBox
        accounts={[]}
        totalBanks={0}
        totalCurrentBalance={0}
        user={user}
      />
    )
  }

  return (
    <Suspense fallback={<AccountsSkeleton />}>
      <AccountsData userId={userId} user={user} />
    </Suspense>
  )
}

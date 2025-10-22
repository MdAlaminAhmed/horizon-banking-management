import { Suspense } from 'react'
import { getAccount, getAccounts } from '@/lib/actions/bank.actions'
import RecentTransactions from './RecentTransactions'

const MOCK_TRANSACTIONS = [
  { id: 't1', $id: 't1', name: 'Uber 063015 SFPOOL', amount: -5.40, type: 'debit', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), paymentChannel: 'online', category: 'Travel', accountId: '', pending: false, image: '', $createdAt: new Date().toISOString(), channel: 'online', senderBankId: '', receiverBankId: '' },
  { id: 't2', $id: 't2', name: 'CREDIT CARD 3333 PAYMENT', amount: 25.00, type: 'credit', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), paymentChannel: 'online', category: 'Payment', accountId: '', pending: false, image: '', $createdAt: new Date().toISOString(), channel: 'online', senderBankId: '', receiverBankId: '' },
  { id: 't3', $id: 't3', name: 'United Airlines', amount: -500.00, type: 'debit', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), paymentChannel: 'in_store', category: 'Travel', accountId: '', pending: false, image: '', $createdAt: new Date().toISOString(), channel: 'in_store', senderBankId: '', receiverBankId: '' },
  { id: 't4', $id: 't4', name: 'McDonalds', amount: -12.00, type: 'debit', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), paymentChannel: 'in_store', category: 'Food and Drink', accountId: '', pending: false, image: '', $createdAt: new Date().toISOString(), channel: 'in_store', senderBankId: '', receiverBankId: '' },
  { id: 't5', $id: 't5', name: 'Starbucks', amount: -4.33, type: 'debit', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), paymentChannel: 'in_store', category: 'Food and Drink', accountId: '', pending: false, image: '', $createdAt: new Date().toISOString(), channel: 'in_store', senderBankId: '', receiverBankId: '' },
]

async function TransactionsData({ userId, page }: { userId: string; page: number }) {
  const accountsRes = await getAccounts({ userId })
  const accounts = accountsRes?.data || []
  const recentAccounts = accounts.slice(0, 2)
  const appwriteItemId = recentAccounts[0]?.appwriteItemId

  let transactions = MOCK_TRANSACTIONS
  if (appwriteItemId) {
    try {
      const account = await getAccount({ appwriteItemId })
      if (account?.transactions && account.transactions.length > 0) {
        transactions = account.transactions
      }
    } catch (e) {
      console.error('Error fetching transactions:', e)
      // Use mock data
    }
  }

  return (
    <RecentTransactions
      accounts={recentAccounts}
      transactions={transactions}
      appwriteItemId={appwriteItemId || recentAccounts[0]?.appwriteItemId}
      page={page}
    />
  )
}

function TransactionsSkeleton() {
  return (
    <div className="recent-transactions animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  )
}

export default function TransactionsWrapper({ userId, page }: { userId: string | null; page: number }) {
  if (!userId) {
    return (
      <RecentTransactions
        accounts={[]}
        transactions={MOCK_TRANSACTIONS}
        appwriteItemId=""
        page={page}
      />
    )
  }

  return (
    <Suspense fallback={<TransactionsSkeleton />}>
      <TransactionsData userId={userId} page={page} />
    </Suspense>
  )
}

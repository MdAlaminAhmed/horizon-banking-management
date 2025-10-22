'use client'

import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from './BankTabItem'
import BankInfo from './BankInfo'
import TransactionsTable from './TransactionsTable'
import { Pagination } from './Pagination'
import { useState } from 'react'

const RecentTransactions = ({
  accounts,
  transactions = [],
  appwriteItemId,
  page = 1,
}: RecentTransactionsProps) => {
  const [selectedBank, setSelectedBank] = useState(appwriteItemId)
  const rowsPerPage = 10;

  // Filter transactions by selected bank
  // For Plaid transactions, they belong to the account they're fetched from
  // For transfer transactions, check senderBankId and receiverBankId
  const filteredTransactions = transactions.filter((t: Transaction) => {
    // If transaction has bank IDs (transfer transactions)
    if (t.senderBankId || t.receiverBankId) {
      return t.senderBankId === selectedBank || t.receiverBankId === selectedBank
    }
    // For Plaid transactions, show all (they're already filtered by account)
    return true
  })

  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <Link
          href={`/transaction-history/?id=${selectedBank}`}
          className="view-all-btn"
        >
          View all
        </Link>
      </header>

      <Tabs 
        value={selectedBank} 
        onValueChange={setSelectedBank}
        className="w-full"
      >
      <TabsList className="recent-transactions-tablist">
          {accounts.map((account: Account) => (
            <TabsTrigger key={account.id} value={account.appwriteItemId}>
              <BankTabItem
                key={account.id}
                account={account}
                appwriteItemId={selectedBank}
              />
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map((account: Account) => (
          <TabsContent
            value={account.appwriteItemId}
            key={account.id}
            className="space-y-4"
          >
            <BankInfo 
              account={account}
              appwriteItemId={selectedBank}
              type="full"
            />

            <TransactionsTable transactions={currentTransactions} />
            

            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={page} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}

export default RecentTransactions
'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useMemo } from 'react'
import BankCard from './BankCard'
import BudgetCategory from './BudgetCategory'
import PlaidLink from './PlaidLink'
import BudgetForm from './BudgetForm'
import { calculateBudgets } from '@/lib/utils/budgets'
import { MoreVertical } from 'lucide-react'

const RightSidebar = ({ user, transactions, banks }: RightSidebarProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [customBudgets, setCustomBudgets] = useState<any[]>([])

  // Calculate budgets dynamically from transactions
  const calculatedBudgets = useMemo(() => {
    return calculateBudgets(transactions || [])
  }, [transactions])

  // Merge calculated and custom budgets, prioritize custom
  const allBudgets = useMemo(() => {
    return [...customBudgets, ...calculatedBudgets].slice(0, 3)
  }, [customBudgets, calculatedBudgets])

  const handleSaveBudget = (budget: { name: string; amount: number; note: string }) => {
    const newBudget = {
      name: budget.name,
      amount: 0,
      total: budget.amount,
      icon: '/icons/dollar-circle.svg',
      color: 'bg-indigo-500',
    }
    setCustomBudgets(prev => [...prev, newBudget])
    console.log('Budget saved:', newBudget) // Debug log
  }

  return (
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8 -mx-6">
        <div className="profile-banner" />
        <div className="profile px-6">
          <div className="profile-img">
            <span className="text-5xl font-bold text-blue-500">
              {user?.firstName?.[0] || 'G'}
            </span>
          </div>

          <div className="profile-details">
            <h1 className="profile-name">
              {user?.firstName || 'Guest'} {user?.lastName || ''}
            </h1>
            <p className="profile-email">{user?.email || 'guest@example.com'}</p>
          </div>
        </div>
      </section>

      <section className="banks">
        <div className="flex w-full justify-between items-center mb-5">
          <h2 className="header-2">My Banks</h2>
          {user && (
            <PlaidLink user={user} variant="ghost" />
          )}
        </div>

        {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5 mb-8">
            <div className="relative z-10 w-full">
              <BankCard
                key={banks[0].$id}
                account={banks[0]}
                userName={user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <BankCard
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-6 bg-gray-50 rounded-xl p-6 -mx-6 px-6">
          <div className="flex justify-between items-center">
            <h2 className="header-2">My budgets</h2>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="p-1 hover:bg-gray-200 rounded-md transition-colors"
              aria-label="Budget options"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-5">
            {allBudgets.length > 0 ? (
              allBudgets.map((budget, index) => (
                <BudgetCategory key={`${budget.name}-${index}`} category={budget} />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No budget data available yet
              </p>
            )}
          </div>
        </div>
      </section>

      <BudgetForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveBudget}
      />
    </aside>
  )
}

export default RightSidebar
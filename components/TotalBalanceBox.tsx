'use client'

import AnimatedCounter from './AnimatedCounter';
import DoughnutChart from './DoughnutChart';
import Image from 'next/image';
import PlaidLink from './PlaidLink';

const TotalBalanceBox = ({
  accounts = [], totalBanks, totalCurrentBalance, user
}: TotalBalanceBoxProps) => {
  return (
    <section className="total-balance">
      <div className="total-balance-chart">
        <DoughnutChart accounts={accounts} />
      </div>

      <div className="flex flex-col gap-6 flex-1 min-w-0">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-18 font-semibold text-gray-900 whitespace-nowrap">
            {totalBanks} Bank Account{totalBanks !== 1 ? 's' : ''}
          </h2>
          {user && (
            <div className="shrink-0">
              <PlaidLink user={user} variant="ghost" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-14 font-normal text-gray-600">
            Total Current Balance
          </p>

          <div className="text-24 lg:text-30 font-semibold text-gray-900">
            <AnimatedCounter amount={totalCurrentBalance} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TotalBalanceBox
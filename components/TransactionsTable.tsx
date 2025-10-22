import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { transactionCategoryStyles } from "@/constants"
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils"

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const {
    borderColor,
    backgroundColor,
    textColor,
    chipBackgroundColor,
  } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default

  return (
    <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
      <div className={cn('size-2 rounded-full', backgroundColor)} />
      <p className={cn('text-[12px] font-medium', textColor)}>{category}</p>
    </div>
  )
}

const TransactionsTable = ({ transactions }: TransactionTableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      {/* Table Header */}
      <div className="grid grid-cols-5 gap-3 px-3 py-2.5 bg-gray-50 rounded-t-lg border-b border-gray-200 min-w-[600px]">
        <div className="text-12 font-medium text-gray-600 tracking-wide font-inter">Transaction</div>
        <div className="text-12 font-medium text-gray-600 tracking-wide font-inter">Amount</div>
        <div className="text-12 font-medium text-gray-600 tracking-wide font-inter">Status</div>
        <div className="text-12 font-medium text-gray-600 tracking-wide font-inter">Date</div>
        <div className="text-12 font-medium text-gray-600 tracking-wide font-inter">Category</div>
      </div>

      {/* Table Body */}
      <div className="bg-white rounded-b-lg overflow-hidden min-w-[600px]">
        {(transactions ?? []).map((t: Transaction, index) => {
          const status = getTransactionStatus(new Date(t.date))
          const amount = formatAmount(t.amount)
          const isDebit = t.type === 'debit' || amount[0] === '-'

          return (
            <div 
              key={t.id} 
              className={cn(
                "grid grid-cols-5 gap-3 px-3 py-3 items-center border-b border-gray-100 hover:bg-gray-50 transition-colors",
                isDebit ? 'bg-red-50/30' : 'bg-green-50/30',
                index === transactions.length - 1 && 'border-b-0'
              )}
            >
              {/* Transaction Name */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-14 font-medium text-gray-900 truncate capitalize font-inter">
                  {removeSpecialCharacters(t.name)}
                </span>
              </div>

              {/* Amount */}
              <div className={cn(
                "text-14 font-semibold font-inter",
                isDebit ? 'text-red-600' : 'text-green-600'
              )}>
                {amount}
              </div>

              {/* Status */}
              <div className="flex items-center">
                <CategoryBadge category={status} />
              </div>

              {/* Date */}
              <div className="text-12 text-gray-600 whitespace-nowrap">
                {formatDateTime(new Date(t.date)).dateTime}
              </div>

              {/* Category */}
              <div className="flex items-center">
                <CategoryBadge category={t.category} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TransactionsTable
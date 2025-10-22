import Image from "next/image"
import { Progress } from "./ui/progress"

interface BudgetCategoryProps {
  category: {
    name: string
    amount: number
    total: number
    icon: string
    color: string
  }
}

const BudgetCategory = ({ category }: BudgetCategoryProps) => {
  const percentage = (category.amount / category.total) * 100
  const remaining = category.total - category.amount

  // Map category color to themed backgrounds and progress colors
  const themeStyles: { [key: string]: { bg: string; progressBg: string; progressIndicator: string } } = {
    'bg-blue-500': {
      bg: 'bg-blue-50',
      progressBg: 'bg-blue-100',
      progressIndicator: 'bg-blue-600',
    },
    'bg-pink-500': {
      bg: 'bg-pink-50',
      progressBg: 'bg-pink-100',
      progressIndicator: 'bg-pink-600',
    },
    'bg-green-500': {
      bg: 'bg-green-50',
      progressBg: 'bg-green-100',
      progressIndicator: 'bg-green-600',
    },
  }

  const theme = themeStyles[category.color] || themeStyles['bg-blue-500']

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl ${theme.bg}`}>
      <div className={`flex-center size-10 rounded-full ${category.color}`}>
        <Image src={category.icon} width={20} height={20} alt={category.name} />
      </div>
      <div className="flex w-full flex-1 flex-col gap-2">
        <div className="flex justify-between">
          <h3 className="text-14 font-medium text-gray-700">{category.name}</h3>
          <p className="text-14 font-semibold text-gray-900">${remaining} left</p>
        </div>
        <Progress
          value={percentage}
          className={`h-2 w-full ${theme.progressBg}`}
          indicatorClassName={`h-2 ${theme.progressIndicator}`}
        />
      </div>
    </div>
  )
}

export default BudgetCategory

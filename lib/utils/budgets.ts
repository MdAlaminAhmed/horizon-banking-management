// Calculate budget usage from transactions
export function calculateBudgets(transactions: Transaction[]) {
  const budgetMap: Record<string, { amount: number; total: number; count: number }> = {}

  // Category mappings to budget categories
  const categoryMap: Record<string, string> = {
    'Transfer': 'Savings',
    'Food and Drink': 'Food and booze',
    'Travel': 'Travel',
    'Payment': 'Subscriptions',
    'Processing': 'Subscriptions',
  }

  // Icon mappings for categories
  const iconMap: Record<string, string> = {
    'Subscriptions': '/icons/monitor.svg',
    'Food and booze': '/icons/shopping-bag.svg',
    'Savings': '/icons/coins.svg',
    'Travel': '/icons/plane.svg',
  }

  // Color mappings for categories
  const colorMap: Record<string, string> = {
    'Subscriptions': 'bg-blue-500',
    'Food and booze': 'bg-pink-500',
    'Savings': 'bg-green-500',
    'Travel': 'bg-purple-500',
  }

  // Initialize default budgets
  const defaultBudgets = ['Subscriptions', 'Food and booze', 'Savings']
  defaultBudgets.forEach(budget => {
    budgetMap[budget] = { amount: 0, total: 0, count: 0 }
  })

  // Calculate spending from transactions
  transactions.forEach((transaction: Transaction) => {
    const budgetCategory = categoryMap[transaction.category] || 'Other'
    const amount = Math.abs(parseFloat(transaction.amount.toString()))

    if (!budgetMap[budgetCategory]) {
      budgetMap[budgetCategory] = { amount: 0, total: 0, count: 0 }
    }

    budgetMap[budgetCategory].amount += amount
    budgetMap[budgetCategory].count += 1
  })

  // Set budget totals based on spending (20% buffer)
  Object.keys(budgetMap).forEach(category => {
    const spending = budgetMap[category].amount
    budgetMap[category].total = Math.max(spending * 1.2, 50) // Minimum $50 budget
  })

  // Convert to array and sort by usage
  const budgets = Object.entries(budgetMap)
    .map(([name, data]) => ({
      name,
      amount: Math.round(data.amount),
      total: Math.round(data.total),
      icon: iconMap[name] || '/icons/dollar-circle.svg',
      color: colorMap[name] || 'bg-gray-500',
      count: data.count,
    }))
    .sort((a, b) => b.count - a.count) // Sort by most used
    .slice(0, 3) // Top 3

  return budgets
}

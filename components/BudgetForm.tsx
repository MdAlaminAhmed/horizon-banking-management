'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BudgetFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (budget: { name: string; amount: number; note: string }) => void
}

const BudgetForm = ({ isOpen, onClose, onSave }: BudgetFormProps) => {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && amount) {
      onSave({
        name,
        amount: parseFloat(amount),
        note,
      })
      // Reset form
      setName('')
      setAmount('')
      setNote('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Budget</DialogTitle>
          <DialogDescription>
            Create a new budget category to track your spending.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-14 font-medium text-gray-700">
              Platform Name
            </label>
            <Input
              id="name"
              placeholder="e.g., Netflix, Spotify"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="text-14 font-medium text-gray-700">
              Budget Amount ($)
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="note" className="text-14 font-medium text-gray-700">
              Note (Optional)
            </label>
            <Textarea
              id="note"
              placeholder="Add a description..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Save Budget
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default BudgetForm

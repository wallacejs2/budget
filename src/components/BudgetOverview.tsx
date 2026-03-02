import React from 'react';
import { Transaction, Budget } from '../types';
import { formatCurrency } from '../utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface BudgetOverviewProps {
  transactions: Transaction[];
  budget: Budget | null;
  onSetBudget: (amount: number) => void;
  currentMonth: string;
}

export function BudgetOverview({ transactions, budget, onSetBudget, currentMonth }: BudgetOverviewProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [newBudgetAmount, setNewBudgetAmount] = React.useState(budget?.amount?.toString() || '');

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;
  const budgetAmount = budget?.amount || 0;
  const remainingBudget = budgetAmount - totalExpenses;
  const progressPercentage = budgetAmount > 0 ? Math.min((totalExpenses / budgetAmount) * 100, 100) : 0;
  const isOverBudget = budgetAmount > 0 && totalExpenses > budgetAmount;

  const handleSaveBudget = () => {
    const amount = parseFloat(newBudgetAmount);
    if (!isNaN(amount) && amount >= 0) {
      onSetBudget(amount);
      setIsEditing(false);
    }
  };

  const getProgressColor = () => {
    if (progressPercentage > 100) return '#FF3B30';
    if (progressPercentage > 85) return '#FF9500';
    return '#007AFF';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-5">
      {/* Balance Section */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-500 mb-1">Balance</p>
        <h2 className={`text-4xl font-bold ${netBalance >= 0 ? 'text-gray-900' : 'text-[#FF3B30]'}`}>
          {formatCurrency(netBalance)}
        </h2>

        <div className="flex items-center gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-sm text-[#34C759]">
            <ArrowUpRight className="w-4 h-4" />
            {formatCurrency(totalIncome)}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-[#FF3B30]">
            <ArrowDownRight className="w-4 h-4" />
            {formatCurrency(totalExpenses)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mb-5" />

      {/* Budget Section */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Monthly Budget</p>
          {isEditing ? (
            <div className="flex items-center gap-1">
              <span className="text-xl text-gray-400">$</span>
              <input
                type="number"
                value={newBudgetAmount}
                onChange={(e) => setNewBudgetAmount(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xl font-semibold text-gray-900 w-32 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 focus:border-[#007AFF]"
                autoFocus
                onBlur={handleSaveBudget}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveBudget()}
              />
            </div>
          ) : (
            <h3
              className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-[#007AFF] transition-colors flex items-center gap-2"
              onClick={() => { setIsEditing(true); setNewBudgetAmount(budgetAmount.toString()); }}
              title="Click to edit budget"
            >
              {formatCurrency(budgetAmount)}
              {budgetAmount === 0 && (
                <span className="text-sm font-medium text-[#007AFF] bg-[#007AFF]/10 px-3 py-1 rounded-full">
                  Set Budget
                </span>
              )}
            </h3>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500 mb-1">Remaining</p>
          <p className={`text-xl font-semibold ${remainingBudget < 0 ? 'text-[#FF3B30]' : 'text-[#34C759]'}`}>
            {formatCurrency(remainingBudget)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progressPercentage}%`,
            backgroundColor: getProgressColor()
          }}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-400">
        <span>{Math.round(progressPercentage)}% used</span>
        {isOverBudget && (
          <span className="text-[#FF3B30]">
            Over by {formatCurrency(Math.abs(remainingBudget))}
          </span>
        )}
      </div>
    </div>
  );
}

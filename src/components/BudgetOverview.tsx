import React from 'react';
import { Transaction, Budget } from '../types';
import { formatCurrency } from '../utils';
import { PieChart, Wallet, TrendingUp, AlertCircle } from 'lucide-react';

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

  const budgetAmount = budget?.amount || 0;
  const remainingBudget = budgetAmount - totalExpenses;
  const progressPercentage = budgetAmount > 0 ? Math.min((totalExpenses / budgetAmount) * 100, 100) : 0;

  const handleSaveBudget = () => {
    const amount = parseFloat(newBudgetAmount);
    if (!isNaN(amount) && amount >= 0) {
      onSetBudget(amount);
      setIsEditing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Balance Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Wallet className="w-16 h-16 text-indigo-500" />
        </div>
        <div className="relative z-10">
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Net Balance</p>
          <h2 className={`text-2xl font-mono font-bold ${totalIncome - totalExpenses >= 0 ? 'text-zinc-100' : 'text-rose-400'}`}>
            {formatCurrency(totalIncome - totalExpenses)}
          </h2>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-zinc-400">
            <span className="text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +{formatCurrency(totalIncome)}
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-rose-400">-{formatCurrency(totalExpenses)}</span>
          </div>
        </div>
      </div>

      {/* Monthly Budget Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden md:col-span-2">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Monthly Budget</p>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono text-zinc-400">$</span>
                <input
                  type="number"
                  value={newBudgetAmount}
                  onChange={(e) => setNewBudgetAmount(e.target.value)}
                  className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xl font-mono text-zinc-100 w-28 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  autoFocus
                  onBlur={handleSaveBudget}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveBudget()}
                />
              </div>
            ) : (
              <h2 
                className="text-2xl font-mono font-bold text-zinc-100 cursor-pointer hover:text-indigo-400 transition-colors flex items-center gap-2"
                onClick={() => setIsEditing(true)}
                title="Click to edit budget"
              >
                {formatCurrency(budgetAmount)}
                {budgetAmount === 0 && <span className="text-[10px] font-sans font-normal text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full">Set Budget</span>}
              </h2>
            )}
          </div>
          <div className="text-right">
            <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Remaining</p>
            <p className={`text-lg font-mono font-bold ${remainingBudget < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatCurrency(remainingBudget)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
          <div 
            className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${
              progressPercentage > 100 ? 'bg-rose-500' : 
              progressPercentage > 85 ? 'bg-amber-500' : 
              'bg-indigo-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-zinc-500 font-mono">
          <span>0%</span>
          <span>{Math.round(progressPercentage)}% Used</span>
          <span>100%</span>
        </div>

        {progressPercentage > 100 && (
          <div className="mt-2 flex items-center gap-2 text-rose-400 text-[10px] bg-rose-500/10 px-2 py-1.5 rounded-lg border border-rose-500/20">
            <AlertCircle className="w-3 h-3" />
            <span>Over budget by {formatCurrency(Math.abs(remainingBudget))}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import { CategoryManager } from './components/CategoryManager';
import { BudgetOverview } from './components/BudgetOverview';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_CATEGORIES } from './constants';
import { Transaction, Category, Budget } from './types';
import { getMonthKey } from './utils';
import { Plus, Settings, ChevronLeft, ChevronRight, PieChart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // State
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('budgetflow_transactions', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('budgetflow_categories', DEFAULT_CATEGORIES);
  const [budgets, setBudgets] = useLocalStorage<Record<string, number>>('budgetflow_budgets', {});
  
  const [currentMonth, setCurrentMonth] = useState(getMonthKey(new Date()));
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  // Derived State
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => t.date.startsWith(currentMonth))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, currentMonth]);

  const currentBudgetAmount = budgets[currentMonth] || 0;

  // Handlers
  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdateCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
  };

  const handleSetBudget = (amount: number) => {
    setBudgets(prev => ({
      ...prev,
      [currentMonth]: amount
    }));
  };

  const changeMonth = (offset: number) => {
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month - 1 + offset);
    setCurrentMonth(getMonthKey(date));
  };

  const formatMonthDisplay = (monthKey: string) => {
    const [year, month] = monthKey.split('-').map(Number);
    return new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <Layout>
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-indigo-500" />
            BudgetFlow
          </h1>
          <p className="text-zinc-500 text-xs mt-0.5">Smart financial tracking</p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
          <button 
            onClick={() => changeMonth(-1)}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono font-medium text-zinc-200 text-sm min-w-[120px] text-center">
            {formatMonthDisplay(currentMonth)}
          </span>
          <button 
            onClick={() => changeMonth(1)}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCategoryManagerOpen(true)}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Manage Categories"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsTransactionModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-900/20"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <BudgetOverview
          transactions={filteredTransactions}
          budget={{ month: currentMonth, amount: currentBudgetAmount }}
          onSetBudget={handleSetBudget}
          currentMonth={currentMonth}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransactionList
              transactions={filteredTransactions}
              categories={categories}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
          
          <div className="space-y-6">
            {/* Quick Stats / Side Panel */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
              <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Top Spending Categories</h3>
              <div className="space-y-3">
                {(Object.entries(
                  filteredTransactions
                    .filter(t => t.type === 'expense')
                    .reduce((acc, t) => {
                      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
                      return acc;
                    }, {} as Record<string, number>)
                ) as [string, number][])
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([catId, amount]) => {
                    const category = categories.find(c => c.id === catId);
                    const totalExpense = filteredTransactions
                      .filter(t => t.type === 'expense')
                      .reduce((sum, t) => sum + t.amount, 0);
                    const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
                    
                    return (
                      <div key={catId} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-300">{category?.name || 'Unknown'}</span>
                          <span className="font-mono text-zinc-400">${amount.toFixed(2)}</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: category?.color || '#71717a'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {filteredTransactions.filter(t => t.type === 'expense').length === 0 && (
                    <p className="text-zinc-600 text-sm italic">No expenses yet this month.</p>
                  )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isTransactionModalOpen && (
          <TransactionForm
            categories={categories}
            onAddTransaction={handleAddTransaction}
            onClose={() => setIsTransactionModalOpen(false)}
          />
        )}
        {isCategoryManagerOpen && (
          <CategoryManager
            categories={categories}
            onUpdateCategories={handleUpdateCategories}
            isOpen={isCategoryManagerOpen}
            onClose={() => setIsCategoryManagerOpen(false)}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}


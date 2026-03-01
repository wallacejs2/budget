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
import { getMonthKey, formatCurrency } from './utils';
import { Plus, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

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
          <h1 className="text-2xl font-bold text-gray-900">BudgetFlow</h1>
          <p className="text-sm text-gray-500 mt-0.5">Smart financial tracking</p>
        </div>

        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xl rounded-xl shadow-sm p-1">
          <button
            onClick={() => changeMonth(-1)}
            className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-gray-900 text-base min-w-[160px] text-center">
            {formatMonthDisplay(currentMonth)}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCategoryManagerOpen(true)}
            className="w-11 h-11 flex items-center justify-center text-[#007AFF] hover:bg-[#007AFF]/10 rounded-xl transition-colors"
            title="Manage Categories"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsTransactionModalOpen(true)}
            className="bg-[#007AFF] hover:bg-[#0066D6] text-white px-5 py-2.5 rounded-full text-base font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <TransactionList
              transactions={filteredTransactions}
              categories={categories}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>

          <div className="space-y-5">
            {/* Top Spending Categories */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Top Spending</h3>
              <div className="space-y-4">
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
                      <div key={catId} className="space-y-1.5">
                        <div className="flex justify-between text-base">
                          <span className="text-gray-900">{category?.name || 'Unknown'}</span>
                          <span className="text-gray-500">{formatCurrency(amount)}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: category?.color || '#8E8E93'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {filteredTransactions.filter(t => t.type === 'expense').length === 0 && (
                    <p className="text-base text-gray-400 italic">No expenses yet this month.</p>
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

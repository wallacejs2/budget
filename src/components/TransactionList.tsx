import React from 'react';
import { Transaction, Category } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { Trash2, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionList({ transactions, categories, onDeleteTransaction }: TransactionListProps) {
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';
  const getSubCategoryName = (catId: string, subId?: string) => {
    if (!subId) return null;
    const cat = categories.find(c => c.id === catId);
    return cat?.subCategories.find(s => s.id === subId)?.name;
  };

  if (transactions.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2 px-1">Recent Activity</h3>
        <div className="bg-white rounded-2xl shadow-sm text-center py-16 px-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4">
            <Receipt className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-base font-medium text-gray-900">No transactions yet</h3>
          <p className="text-sm text-gray-500 mt-1">Add a transaction to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-sm font-medium text-gray-500">Recent Activity</h3>
        <span className="text-sm text-gray-400">{transactions.length} transactions</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <AnimatePresence initial={false}>
          {transactions.map((transaction, index) => {
            const category = categories.find(c => c.id === transaction.categoryId);
            const subCategoryName = getSubCategoryName(transaction.categoryId, transaction.subCategoryId);

            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="overflow-hidden"
              >
                <div className={`group flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                  index < transactions.length - 1 ? 'border-b border-gray-100' : ''
                }`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: category?.color || '#8E8E93' }}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-base text-gray-900 truncate">{transaction.description}</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {formatDate(transaction.date)}
                        {' · '}
                        {category?.name}
                        {subCategoryName && ` · ${subCategoryName}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pl-3 shrink-0">
                    <span className={`text-base font-semibold ${
                      transaction.type === 'income' ? 'text-[#34C759]' : 'text-gray-900'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>

                    <button
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="opacity-100 md:opacity-0 group-hover:opacity-100 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-lg transition-all"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

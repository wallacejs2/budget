import React from 'react';
import { Transaction, Category } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { ArrowUpRight, ArrowDownLeft, Trash2, Tag } from 'lucide-react';
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
      <div className="text-center py-12 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 border-dashed">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/50 mb-4">
          <Tag className="w-5 h-5 text-zinc-500" />
        </div>
        <h3 className="text-zinc-400 font-medium">No transactions yet</h3>
        <p className="text-zinc-600 text-sm mt-1">Add a transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
        Recent Activity
        <span className="text-[10px] font-normal text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded-full border border-zinc-800">
          {transactions.length}
        </span>
      </h3>
      
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {transactions.map((transaction) => {
            const category = categories.find(c => c.id === transaction.categoryId);
            const subCategoryName = getSubCategoryName(transaction.categoryId, transaction.subCategoryId);
            
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 rounded-xl p-3 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      transaction.type === 'income' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {transaction.type === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-200 text-sm truncate">{transaction.description}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[10px] text-zinc-500 font-mono shrink-0">{formatDate(transaction.date)}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-zinc-700 shrink-0" />
                        <span 
                          className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700/50 truncate max-w-[100px]"
                          style={{ color: category?.color }}
                        >
                          {category?.name}
                        </span>
                        {subCategoryName && (
                          <>
                            <span className="text-zinc-600 text-[8px]">&gt;</span>
                            <span className="text-[10px] text-zinc-500 truncate max-w-[80px]">{subCategoryName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pl-2">
                    <span className={`font-mono font-medium text-base whitespace-nowrap ${
                      transaction.type === 'income' ? 'text-emerald-400' : 'text-zinc-100'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                    
                    <button
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="opacity-100 md:opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Category, Transaction, TransactionType } from '../types';
import { motion } from 'motion/react';

interface TransactionFormProps {
  categories: Category[];
  onAddTransaction: (transaction: Transaction) => void;
  onClose: () => void;
}

export function TransactionForm({ categories, onAddTransaction, onClose }: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');

  // Filter categories by type
  const availableCategories = categories.filter(c => c.type === type);

  // Reset category when type changes
  useEffect(() => {
    setCategoryId('');
    setSubCategoryId('');
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId || !description) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      date,
      description,
      categoryId,
      subCategoryId: subCategoryId || undefined,
      type,
    };

    onAddTransaction(newTransaction);
    onClose();
  };

  const selectedCategory = categories.find(c => c.id === categoryId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
          <h2 className="text-base font-semibold text-zinc-100">Add Transaction</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Type Toggle */}
          <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                type === 'expense' 
                  ? 'bg-rose-500/10 text-rose-400 shadow-sm ring-1 ring-rose-500/20' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                type === 'income' 
                  ? 'bg-emerald-500/10 text-emerald-400 shadow-sm ring-1 ring-emerald-500/20' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-sm">$</span>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-6 pr-4 py-2 text-base font-mono text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-700"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-700"
              placeholder="What was this for?"
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Category</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
              >
                <option value="">Select...</option>
                {availableCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Sub-Category</label>
              <select
                value={subCategoryId}
                onChange={(e) => setSubCategoryId(e.target.value)}
                disabled={!selectedCategory || selectedCategory.subCategories.length === 0}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">None</option>
                {selectedCategory?.subCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all [color-scheme:dark]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg shadow-indigo-900/20"
          >
            <Check className="w-4 h-4" />
            Save Transaction
          </button>
        </form>
      </motion.div>
    </div>
  );
}

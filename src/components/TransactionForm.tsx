import React, { useState, useEffect } from 'react';
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

  const availableCategories = categories.filter(c => c.type === type);

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
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 400, damping: 36 }}
        className="bg-white rounded-t-3xl w-full max-w-lg shadow-2xl"
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <button onClick={onClose} className="text-base text-[#007AFF]">Cancel</button>
          <h2 className="text-base font-semibold text-gray-900">Add Transaction</h2>
          <div className="w-14" />
        </div>

        <form onSubmit={handleSubmit} className="px-5 pb-8 space-y-5">
          {/* Segmented Control — Income / Expense */}
          <div className="relative bg-gray-100 p-1 rounded-xl flex">
            <motion.div
              className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm"
              style={{ width: 'calc(50% - 4px)' }}
              animate={{ left: type === 'expense' ? '4px' : 'calc(50%)' }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`relative z-10 flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                type === 'expense' ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`relative z-10 flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                type === 'income' ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-gray-500 mb-1.5 block">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl font-semibold">$</span>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-2xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 focus:border-[#007AFF] transition-all placeholder:text-gray-300"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-500 mb-1.5 block">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 focus:border-[#007AFF] transition-all placeholder:text-gray-400"
              placeholder="What was this for?"
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1.5 block">Category</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 focus:border-[#007AFF] transition-all appearance-none"
              >
                <option value="">Select...</option>
                {availableCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-1.5 block">Sub-category</label>
              <select
                value={subCategoryId}
                onChange={(e) => setSubCategoryId(e.target.value)}
                disabled={!selectedCategory || selectedCategory.subCategories.length === 0}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 focus:border-[#007AFF] transition-all appearance-none disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="">None</option>
                {selectedCategory?.subCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium text-gray-500 mb-1.5 block">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 focus:border-[#007AFF] transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#007AFF] hover:bg-[#0066D6] text-white py-3.5 rounded-2xl text-base font-semibold transition-colors shadow-sm active:scale-[0.98] transform"
          >
            Save Transaction
          </button>
        </form>
      </motion.div>
    </div>
  );
}

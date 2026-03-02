import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronRight, Palette } from 'lucide-react';
import { Category, SubCategory } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CategoryManagerProps {
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = [
  '#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#0ABDE3',
  '#10AC84', '#2ED573', '#5F27CD', '#A29BFE', '#E056A0',
  '#F368E0', '#FF6348', '#3B82F6', '#007AFF', '#8E8E93'
];

export function CategoryManager({ categories, onUpdateCategories, isOpen, onClose }: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense'>('expense');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [editingColorId, setEditingColorId] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: newCategoryName,
      type: newCategoryType,
      subCategories: [],
      color: randomColor
    };
    onUpdateCategories([...categories, newCategory]);
    setNewCategoryName('');
  };

  const handleAddSubCategory = (categoryId: string) => {
    if (!newSubCategoryName.trim()) return;
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subCategories: [...cat.subCategories, { id: crypto.randomUUID(), name: newSubCategoryName }]
        };
      }
      return cat;
    });
    onUpdateCategories(updatedCategories);
    setNewSubCategoryName('');
  };

  const handleDeleteCategory = (id: string) => {
    onUpdateCategories(categories.filter(c => c.id !== id));
  };

  const handleDeleteSubCategory = (categoryId: string, subId: string) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subCategories: cat.subCategories.filter(sub => sub.id !== subId)
        };
      }
      return cat;
    });
    onUpdateCategories(updatedCategories);
  };

  const handleUpdateColor = (categoryId: string, color: string) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, color };
      }
      return cat;
    });
    onUpdateCategories(updatedCategories);
    setEditingColorId(null);
  };

  if (!isOpen) return null;

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
        className="bg-white rounded-t-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl"
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 shrink-0">
          <button onClick={onClose} className="text-base text-[#007AFF]">Done</button>
          <h2 className="text-base font-semibold text-gray-900">Manage Categories</h2>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-5">
          {/* Add New Category */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-500">New Category</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 focus:border-[#007AFF] placeholder:text-gray-400"
                placeholder="Category name"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <select
                value={newCategoryType}
                onChange={(e) => setNewCategoryType(e.target.value as 'income' | 'expense')}
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 focus:border-[#007AFF] appearance-none sm:w-36"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <button
                onClick={handleAddCategory}
                className="bg-[#007AFF] hover:bg-[#0066D6] text-white px-5 py-3 rounded-xl text-base font-semibold transition-colors flex items-center justify-center gap-2 active:scale-[0.98] transform"
              >
                <Plus className="w-5 h-5" /> Add
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {categories.map((category, index) => (
              <div key={category.id}>
                <div
                  className={`flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors ${
                    index < categories.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {expandedCategory === category.id
                      ? <ChevronDown className="w-4 h-4 text-gray-400" />
                      : <ChevronRight className="w-4 h-4 text-gray-400" />
                    }

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingColorId(editingColorId === category.id ? null : category.id);
                      }}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                      style={{ backgroundColor: category.color || '#8E8E93' }}
                      title="Change Color"
                    />

                    <span className="text-base text-gray-900">{category.name}</span>
                    <span className="text-sm text-gray-500">
                      {category.type}
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id); }}
                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Color Picker */}
                <AnimatePresence>
                  {editingColorId === category.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-gray-50 border-y border-gray-100">
                        <div className="flex flex-wrap gap-2">
                          {COLORS.map((color) => (
                            <button
                              key={color}
                              onClick={() => handleUpdateColor(category.id, color)}
                              className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
                                category.color === color ? 'ring-2 ring-[#007AFF] ring-offset-2 scale-110' : ''
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Subcategories */}
                <AnimatePresence>
                  {expandedCategory === category.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-gray-50 border-t border-gray-100 px-4 py-3 pl-12">
                        <div className="space-y-2">
                          {category.subCategories.map((sub) => (
                            <div key={sub.id} className="flex items-center justify-between group py-1">
                              <span className="text-sm text-gray-600">{sub.name}</span>
                              <button
                                onClick={() => handleDeleteSubCategory(category.id, sub.id)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 opacity-100 sm:opacity-0 group-hover:opacity-100 hover:text-[#FF3B30] rounded-lg transition-all"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}

                          <div className="flex gap-2 pt-2 border-t border-gray-200">
                            <input
                              type="text"
                              value={newSubCategoryName}
                              onChange={(e) => setNewSubCategoryName(e.target.value)}
                              placeholder="New sub-category..."
                              className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 focus:border-[#007AFF] placeholder:text-gray-400"
                              onKeyDown={(e) => e.key === 'Enter' && handleAddSubCategory(category.id)}
                            />
                            <button
                              onClick={() => handleAddSubCategory(category.id)}
                              className="w-9 h-9 flex items-center justify-center text-[#007AFF] hover:bg-[#007AFF]/10 rounded-lg transition-colors"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

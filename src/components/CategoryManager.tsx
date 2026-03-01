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
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', 
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', 
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#71717a'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl"
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-100">Manage Categories</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Add New Category */}
          <div className="flex flex-col sm:flex-row gap-3 items-end bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
            <div className="flex-1 space-y-1.5 w-full">
              <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">New Category Name</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="e.g., Travel"
              />
            </div>
            <div className="w-full sm:w-32 space-y-1.5">
              <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Type</label>
              <select
                value={newCategoryType}
                onChange={(e) => setNewCategoryType(e.target.value as 'income' | 'expense')}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <button
              onClick={handleAddCategory}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {/* List Categories */}
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50 relative">
                <div 
                  className="flex items-center justify-between p-3 hover:bg-zinc-800/50 cursor-pointer transition-colors"
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {expandedCategory === category.id ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingColorId(editingColorId === category.id ? null : category.id);
                      }}
                      className="w-5 h-5 rounded-full border border-zinc-700 hover:scale-110 transition-transform flex items-center justify-center group/color"
                      style={{ backgroundColor: category.color || '#ccc' }}
                      title="Change Color"
                    >
                      <Palette className="w-2.5 h-2.5 text-white opacity-0 group-hover/color:opacity-100 transition-opacity drop-shadow-md" />
                    </button>

                    <span className="font-medium text-zinc-200 text-sm">{category.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${category.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {category.type}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id); }}
                    className="text-zinc-500 hover:text-rose-400 transition-colors p-1 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Color Picker Popover */}
                <AnimatePresence>
                  {editingColorId === category.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-zinc-950 border-y border-zinc-800 overflow-hidden"
                    >
                      <div className="p-3 grid grid-cols-9 gap-2">
                        {COLORS.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleUpdateColor(category.id, color)}
                            className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 ${category.color === color ? 'border-white scale-110 ring-2 ring-white/20' : 'border-transparent'}`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {expandedCategory === category.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-zinc-950/30 border-t border-zinc-800"
                    >
                      <div className="p-3 pl-10 space-y-2">
                        {category.subCategories.map((sub) => (
                          <div key={sub.id} className="flex items-center justify-between group">
                            <span className="text-xs text-zinc-400">{sub.name}</span>
                            <button 
                              onClick={() => handleDeleteSubCategory(category.id, sub.id)}
                              className="text-zinc-600 hover:text-rose-400 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        
                        <div className="flex gap-2 mt-2 pt-2 border-t border-zinc-800/50">
                          <input
                            type="text"
                            value={newSubCategoryName}
                            onChange={(e) => setNewSubCategoryName(e.target.value)}
                            placeholder="New sub-category..."
                            className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-500/50"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSubCategory(category.id)}
                          />
                          <button
                            onClick={() => handleAddSubCategory(category.id)}
                            className="text-emerald-500 hover:text-emerald-400 p-1"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
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

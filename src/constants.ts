import { Category } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat_1',
    name: 'Housing',
    type: 'expense',
    color: '#FF6B6B',
    subCategories: [
      { id: 'sub_1_1', name: 'Rent/Mortgage' },
      { id: 'sub_1_2', name: 'Utilities' },
      { id: 'sub_1_3', name: 'Maintenance' },
    ],
  },
  {
    id: 'cat_2',
    name: 'Food',
    type: 'expense',
    color: '#FF9F43',
    subCategories: [
      { id: 'sub_2_1', name: 'Groceries' },
      { id: 'sub_2_2', name: 'Dining Out' },
    ],
  },
  {
    id: 'cat_3',
    name: 'Transportation',
    type: 'expense',
    color: '#FECA57',
    subCategories: [
      { id: 'sub_3_1', name: 'Fuel' },
      { id: 'sub_3_2', name: 'Public Transit' },
      { id: 'sub_3_3', name: 'Car Payment' },
    ],
  },
  {
    id: 'cat_4',
    name: 'Entertainment',
    type: 'expense',
    color: '#A29BFE',
    subCategories: [
      { id: 'sub_4_1', name: 'Movies' },
      { id: 'sub_4_2', name: 'Games' },
      { id: 'sub_4_3', name: 'Subscriptions' },
    ],
  },
  {
    id: 'cat_5',
    name: 'Income',
    type: 'income',
    color: '#2ED573',
    subCategories: [
      { id: 'sub_5_1', name: 'Salary' },
      { id: 'sub_5_2', name: 'Freelance' },
      { id: 'sub_5_3', name: 'Investments' },
    ],
  },
];

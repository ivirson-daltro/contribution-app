import { ExpenseCategory } from './expense-category.model';

export interface Expense {
  id: string;
  value: number;
  categoryId: string;
  category: ExpenseCategory;
  notes: string;
  date: string;
  attachmentUrl: string;
}

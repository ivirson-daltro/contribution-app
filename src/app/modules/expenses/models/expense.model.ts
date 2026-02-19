import { ExpenseCategory } from '../../parameters/models/parameters.models';

export interface Expense {
  id: string;
  value: number;
  categoryId: string;
  category: ExpenseCategory;
  notes: string;
  date: string;
  attachmentUrl: string;
}

import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { first } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../shared/services/toast.service';
import { UserRoles } from '../users/constants/user-roles.enum';
import { User } from '../users/models/user.model';
import { Expense } from './models/expense.model';
import { ExpensesService } from './services/expenses.service';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { UtilsService } from '../../shared/services/utils.service';
import { AddExpensesComponent } from './components/add/add-expenses.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-expenses',
  imports: [MatIconModule, MatCardModule, FormsModule, AsyncPipe, DatePipe, CurrencyPipe],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent implements OnInit {
  private readonly expensesService = inject(ExpensesService);
  private readonly toastService = inject(ToastService);
  private readonly dialog = inject(MatDialog);
  public readonly utilsService = inject(UtilsService);

  form!: FormGroup;
  user: User | null = this.getUserFromLocalStorage();
  userRoles = UserRoles;

  categories$ = this.expensesService.getCategories();

  expenses: Expense[] = [];
  totalExpenses = 0;
  pageIndex = 0; // índice baseado em 0
  pageSize = 10;
  sortBy: 'date' | 'value' | 'categoryId' = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  startDate: string | null = null;
  endDate: string | null = null;
  categoryId: string | null = null;

  ngOnInit(): void {
    this.loadExpenses();
  }

  getUserFromLocalStorage(): User | null {
    const user = localStorage.getItem(environment.APP_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  loadExpenses(pageIndex: number = this.pageIndex, pageSize: number = this.pageSize): void {
    const page = pageIndex + 1;
    this.expensesService
      .getExpenses(
        this.startDate,
        this.endDate,
        this.categoryId,
        page,
        pageSize,
        this.sortBy,
        this.sortDirection,
      )
      .pipe(first())
      .subscribe((res) => {
        if (!res) {
          this.expenses = [];
          this.totalExpenses = 0;
          return;
        }
        console.log('Expenses:', res);
        this.expenses = res.data ?? [];
        this.totalExpenses = res.total ?? 0;
        this.pageIndex = (res.page ?? page) - 1;
        this.pageSize = res.limit ?? pageSize;
      });
  }

  openNewExpense(): void {
    const dialogRef = this.dialog.open(AddExpensesComponent, {
      width: '720px',
      maxWidth: '95vw',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result: unknown) => {
      if (result) {
        this.loadExpenses();
      }
    });
  }

  getMonthlyReport(): void {
    // Implementar lógica para gerar e baixar o relatório mensal de despesas
    this.toastService.success('Relatório mensal de despesas gerado com sucesso!');
  }

  get totalPages(): number {
    return this.pageSize > 0 ? Math.ceil(this.totalExpenses / this.pageSize) : 0;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index);
  }

  goToPage(pageIndex: number): void {
    if (pageIndex < 0 || pageIndex >= this.totalPages || pageIndex === this.pageIndex) {
      return;
    }

    this.pageIndex = pageIndex;
    this.loadExpenses(this.pageIndex, this.pageSize);
  }

  changeSort(field: 'date' | 'value' | 'categoryId'): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }

    this.pageIndex = 0;
    this.loadExpenses(0, this.pageSize);
  }

  editExpense(expenseId: string): void {
    this.expensesService
      .getById(expenseId)
      .pipe(first())
      .subscribe({
        next: (expense) => {
          const dialogRef = this.dialog.open(AddExpensesComponent, {
            width: '720px',
            maxWidth: '95vw',
            autoFocus: false,
            data: expense,
          });
          dialogRef.afterClosed().subscribe((result: unknown) => {
            if (result) {
              this.loadExpenses();
            }
          });
        },
        error: (error) => {
          this.toastService.error(
            error.error.error || 'Erro desconhecido',
            'Erro ao buscar dados da despesa',
          );
        },
      });
  }

  deleteExpense(expenseId: string): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {
        title: 'Excluir Despesa',
        subtitle: 'Tem certeza que deseja excluir esta despesa?',
        confirmLabel: 'Excluir',
        cancelLabel: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.onDeleteExpense(expenseId);
      }
    });
  }

  onDeleteExpense(expenseId: string): void {
    this.expensesService
      .deleteExpense(expenseId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastService.success('Despesa excluída com sucesso.');
          this.loadExpenses();
        },
        error: (error) => {
          this.toastService.error(
            error.error.error || 'Erro desconhecido',
            'Erro ao excluir a despesa',
          );
        },
      });
  }

  limpar(): void {
    this.startDate = null;
    this.endDate = null;
    this.categoryId = null;
    this.loadExpenses();
  }

  async downloadAttachment(item: Expense): Promise<void> {
    this.expensesService.downloadAttachment(item).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Tenta extrair o nome do arquivo da URL
        const fileName = 'anexo' + new Date().getTime();
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);
      },
      error: () => {
        this.toastService.error('Não foi possível baixar o arquivo.');
      },
    });
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ParametersService } from './services/parameters.service';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  ContributionType,
  ExpenseCategory,
  MemberType,
  PaymentMethod,
} from './models/parameters.models';
import { ToastService } from '../../shared/services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { AddMemberTypeComponent } from './components/add-member-type/add-member-type.component';
import { first, Observable } from 'rxjs';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { AddContributionTypeComponent } from './components/add-contribution-type/add-contribution-type.component';
import { AddPaymentMethodComponent } from './components/add-payment-method/add-payment-method.component';
import { AddExpenseCategoryComponent } from './components/add-expense-category/add-expense-category.component';
import { environment } from '../../../environments/environment';
import { User } from '../users/models/user.model';
import { UserRoles } from '../users/constants/user-roles.enum';

@Component({
  selector: 'app-parameters',
  imports: [MatExpansionModule, MatIconModule, AsyncPipe],
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss'],
})
export class ParametersComponent implements OnInit {
  private readonly parametersService = inject(ParametersService);
  private readonly toastService = inject(ToastService);
  private readonly dialog = inject(MatDialog);

  memberTypes$!: Observable<MemberType[]>;
  paymentMethods$!: Observable<PaymentMethod[]>;
  contributionTypes$!: Observable<ContributionType[]>;
  expenseCategories$!: Observable<ExpenseCategory[]>;

  user: User | null = this.getUserFromLocalStorage();
  userRoles = UserRoles;

  ngOnInit(): void {
    this.loadMemberTypes();
    this.loadContributionTypes();
    this.loadPaymentMethods();
    this.loadExpenseCategories();
  }

  getUserFromLocalStorage(): User | null {
    try {
      const user = localStorage.getItem(environment.APP_USER_KEY);
      if (!user) return null;
      const parsed = JSON.parse(user);
      // Garante que tem os campos esperados
      if (typeof parsed === 'object' && parsed && parsed.role && parsed.name && parsed.email) {
        return parsed;
      }
      // Se inválido, limpa e força logout
      localStorage.removeItem(environment.APP_USER_KEY);
      return null;
    } catch {
      localStorage.removeItem(environment.APP_USER_KEY);
      return null;
    }
  }

  // Métodos para carregar os parâmetros
  loadMemberTypes(): void {
    this.memberTypes$ = this.parametersService.getMemberTypes();
  }

  loadPaymentMethods(): void {
    this.paymentMethods$ = this.parametersService.getPaymentMethods();
  }

  loadContributionTypes(): void {
    this.contributionTypes$ = this.parametersService.getContributionTypes();
  }

  loadExpenseCategories(): void {
    this.expenseCategories$ = this.parametersService.getExpenseCategories();
  }

  // Métodos para abrir modais de criação, edição e exclusão de tipos de membro
  openAddMemberType(): void {
    this.openNewParameter(AddMemberTypeComponent, () => this.loadMemberTypes());
  }

  openEditMemberType(memberType: MemberType): void {
    this.editParameter(AddMemberTypeComponent, memberType, () => this.loadMemberTypes());
  }

  openDeleteMemberType(id: string): void {
    this.deleteParameter(
      (id) => this.parametersService.deleteMemberType(id),
      () => this.loadMemberTypes(),
      id,
      'Tipo de Membro',
      'Tem certeza que deseja excluir este tipo de membro?',
    );
  }

  // Métodos para abrir modais de criação, edição e exclusão de tipos de contribuição
  openAddContributionType(): void {
    this.openNewParameter(AddContributionTypeComponent, () => this.loadContributionTypes());
  }

  openEditContributionType(contributionType: ContributionType): void {
    this.editParameter(AddContributionTypeComponent, contributionType, () =>
      this.loadContributionTypes(),
    );
  }

  openDeleteContributionType(id: string): void {
    this.deleteParameter(
      (id) => this.parametersService.deleteContributionType(id),
      () => this.loadContributionTypes(),
      id,
      'Tipo de Contribuição',
      'Tem certeza que deseja excluir este tipo de contribuição?',
    );
  }

  // Métodos para abrir modais de criação, edição e exclusão de métodos de pagamento
  openAddPaymentMethod(): void {
    this.openNewParameter(AddPaymentMethodComponent, () => this.loadPaymentMethods());
  }

  openEditPaymentMethod(paymentMethod: PaymentMethod): void {
    this.editParameter(AddPaymentMethodComponent, paymentMethod, () => this.loadPaymentMethods());
  }

  openDeletePaymentMethod(id: string): void {
    this.deleteParameter(
      (id) => this.parametersService.deletePaymentMethod(id),
      () => this.loadPaymentMethods(),
      id,
      'Método de Pagamento',
      'Tem certeza que deseja excluir este método de pagamento?',
    );
  }

  // Métodos para abrir modais de criação, edição e exclusão de categorias de despesa
  openAddExpenseCategory(): void {
    this.openNewParameter(AddExpenseCategoryComponent, () => this.loadExpenseCategories());
  }

  openEditExpenseCategory(expenseCategory: ExpenseCategory): void {
    this.editParameter(AddExpenseCategoryComponent, expenseCategory, () =>
      this.loadExpenseCategories(),
    );
  }

  openDeleteExpenseCategory(id: string): void {
    this.deleteParameter(
      (id) => this.parametersService.deleteExpenseCategory(id),
      () => this.loadExpenseCategories(),
      id,
      'Categoria de Despesa',
      'Tem certeza que deseja excluir esta categoria de despesa?',
    );
  }

  // Métodos genéricos para abrir modais de criação/edição e confirmação de exclusão
  openNewParameter(component: any, reloadFn: () => void): void {
    const dialogRef = this.dialog.open(component, {
      width: '720px',
      maxWidth: '95vw',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result: unknown) => {
      if (result) reloadFn();
    });
  }

  editParameter(component: any, data: any, reloadFn: () => void): void {
    const dialogRef = this.dialog.open(component, {
      width: '720px',
      maxWidth: '95vw',
      autoFocus: false,
      data,
    });
    dialogRef.afterClosed().subscribe((result: unknown) => {
      if (result) reloadFn();
    });
  }

  deleteParameter(
    deleteFn: (id: string) => Observable<any>,
    reloadFn: () => void,
    id: string,
    title: string,
    subtitle: string,
  ): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {
        title,
        subtitle,
        confirmLabel: 'Excluir',
        cancelLabel: 'Cancelar',
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        deleteFn(id)
          .pipe(first())
          .subscribe({
            next: () => {
              this.toastService.success(`${title} excluído com sucesso.`);
              reloadFn();
            },
            error: (error) => {
              this.toastService.error(
                error.error.error || 'Erro desconhecido',
                `Erro ao excluir ${title}`,
              );
            },
          });
      }
    });
  }
}

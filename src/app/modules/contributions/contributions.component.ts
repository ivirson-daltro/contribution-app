import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { first, Observable } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { Contribution, ContributionType, Member, PaymentMethod } from '../home/models/domain.model';
import { DashboardService } from '../home/services/dashboard.service';
import { AddContributionComponent } from './components/add/add-contributions.component';
import { WeeklyReportDialogComponent } from './components/weekly-report-dialog/weekly-report-dialog.component';
import { ContributionsService } from './services/contributions.service';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { environment } from '../../../environments/environment';
import { User } from '../users/models/user.model';
import { UserRoles } from '../users/constants/user-roles.enum';
import { MembersService } from '../members/services/members.service';
import { UtilsService } from '../../shared/services/utils.service';
import { TipoAnexo } from '../../shared/constants/tipo-anexo.enum';

@Component({
  selector: 'app-contributions',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    AsyncPipe,
    DatePipe,
    CurrencyPipe,
    FormsModule,
  ],
  templateUrl: './contributions.component.html',
  styleUrls: ['./contributions.component.scss'],
})
export class ContributionsComponent implements OnInit {
  private readonly contributionsService = inject(ContributionsService);
  private readonly membersService = inject(MembersService);
  private readonly dialog = inject(MatDialog);
  private readonly toastService = inject(ToastService);
  public readonly utilsService = inject(UtilsService);

  form!: FormGroup;
  user: User | null = this.getUserFromLocalStorage();
  userRoles = UserRoles;

  members$: Observable<Member[]> = this.membersService.getMembers();
  contributionTypes$: Observable<ContributionType[]> =
    this.contributionsService.getContributionTypes();
  paymentMethods$: Observable<PaymentMethod[]> = this.contributionsService.getPaymentMethods();

  contributions: Contribution[] = [];
  totalContributions = 0;
  pageIndex = 0; // índice baseado em 0
  pageSize = 10;
  sortBy: 'date' | 'amount' | 'memberName' | 'paymentMethodDescription' | 'contributionTypeType' =
    'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  // Filter
  memberId: string | null = null;
  contributionTypeId: string | null = null;
  paymentMethodId: string | null = null;
  startDate: string | null = null;
  endDate: string | null = null;

  ngOnInit(): void {
    this.getContributionList();
  }

  getUserFromLocalStorage(): User | null {
    const user = localStorage.getItem(environment.APP_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  openNewContribution(): void {
    const dialogRef = this.dialog.open(AddContributionComponent, {
      width: '720px',
      maxWidth: '95vw',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: unknown) => {
      if (result) {
        this.getContributionList();
      }
    });
  }

  getContributionList(pageIndex: number = this.pageIndex, pageSize: number = this.pageSize): void {
    const page = pageIndex + 1; // API assumida como 1-based

    this.contributionsService
      .getContributions(
        this.memberId,
        this.contributionTypeId,
        this.paymentMethodId,
        page,
        pageSize,
        this.sortBy,
        this.sortDirection,
      )
      .pipe(first())
      .subscribe((res) => {
        if (!res) {
          this.contributions = [];
          this.totalContributions = 0;
          return;
        }

        this.contributions = res.data ?? [];
        this.totalContributions = res.total ?? 0;
        this.pageIndex = (res.page ?? page) - 1;
        this.pageSize = res.limit ?? pageSize;
      });
  }

  get totalPages(): number {
    return this.pageSize > 0 ? Math.ceil(this.totalContributions / this.pageSize) : 0;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index);
  }

  goToPage(pageIndex: number): void {
    if (pageIndex < 0 || pageIndex >= this.totalPages || pageIndex === this.pageIndex) {
      return;
    }

    this.pageIndex = pageIndex;
    this.getContributionList(this.pageIndex, this.pageSize);
  }

  changeSort(
    field: 'date' | 'amount' | 'memberName' | 'paymentMethodDescription' | 'contributionTypeType',
  ): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }

    this.pageIndex = 0;
    this.getContributionList(0, this.pageSize);
  }

  limpar(): void {
    this.memberId = null;
    this.contributionTypeId = null;
    this.paymentMethodId = null;
    this.getContributionList(0, this.pageSize);
  }

  getWeeklyReport(): void {
    const dialogRef = this.dialog.open(WeeklyReportDialogComponent, {
      width: '400px',
      autoFocus: false,
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (!result) {
          return;
        }

        const { startDate, endDate } = result as { startDate: string; endDate: string };

        if (!startDate || !endDate) {
          this.toastService.warning('Informe a data inicial e final para o relatório.');
          return;
        }

        this.contributionsService
          .getWeeklyReport(startDate, endDate)
          .pipe(first())
          .subscribe({
            next: (blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `relatorio-semanal-${startDate}-a-${endDate}.pdf`;
              a.click();
              window.URL.revokeObjectURL(url);
            },
            error: (error) => {
              this.toastService.error(
                error.error.error || 'Erro desconhecido',
                'Erro ao gerar relatório semanal',
              );
            },
          });
      });
  }

  editContribution(contributionId: string): void {
    this.contributionsService
      .getContributionById(contributionId)
      .pipe(first())
      .subscribe({
        next: (contribution) => {
          const dialogRef = this.dialog.open(AddContributionComponent, {
            width: '720px',
            maxWidth: '95vw',
            autoFocus: false,
            data: contribution,
          });
          dialogRef.afterClosed().subscribe((result: unknown) => {
            if (result) {
              this.getContributionList();
            }
          });
        },
        error: (error) => {
          this.toastService.error(
            error.error.error || 'Erro desconhecido',
            'Erro ao buscar dados da contribuição',
          );
        },
      });
  }

  deleteContribution(contributionId: string): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {
        title: 'Excluir Contribuição',
        subtitle: 'Tem certeza que deseja excluir esta contribuição?',
        confirmLabel: 'Excluir',
        cancelLabel: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.onDeleteContribution(contributionId);
      }
    });
  }

  onDeleteContribution(contributionId: string): void {
    this.contributionsService
      .deleteContribution(contributionId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastService.success('Contribuição excluída com sucesso.');
          this.getContributionList();
        },
        error: (error) => {
          this.toastService.error(
            error.error.error || 'Erro desconhecido',
            'Erro ao excluir a contribuição',
          );
        },
      });
  }

  async downloadAttachment(url: string): Promise<void> {
    this.utilsService.downloadAttachment(url, TipoAnexo.CONTRIBUICAO);
  }
}

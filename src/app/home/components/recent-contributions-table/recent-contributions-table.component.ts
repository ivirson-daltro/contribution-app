import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Contribution, ContributionType, Member, PaymentMethod } from '../../models/domain.model';
import { first, Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ContributionsService } from '../../../contributions/services/contributions.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { WeeklyReportDialogComponent } from '../weekly-report-dialog/weekly-report-dialog.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-recent-contributions-table',
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
  templateUrl: './recent-contributions-table.component.html',
  styleUrls: ['./recent-contributions-table.component.scss'],
})
export class RecentContributionsTableComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly contributionsService = inject(ContributionsService);
  private readonly dialog = inject(MatDialog);
  private readonly toastService = inject(ToastService);

  form!: FormGroup;

  members$: Observable<Member[]> = this.contributionsService.getMembers();
  contributionTypes$: Observable<ContributionType[]> =
    this.contributionsService.getContributionTypes();
  paymentMethods$: Observable<PaymentMethod[]> = this.contributionsService.getPaymentMethods();

  contributions: Contribution[] = [];
  totalContributions = 0;
  pageIndex = 0; // índice baseado em 0
  pageSize = 10;
  sortBy: 'date' | 'amount' | 'createdAt' | 'memberId' | 'paymentMethodId' | 'contributionTypeId' =
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

  refresh(): void {
    this.getContributionList(this.pageIndex, this.pageSize);
  }

  getContributionList(pageIndex: number = this.pageIndex, pageSize: number = this.pageSize): void {
    const page = pageIndex + 1; // API assumida como 1-based

    this.dashboardService
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
    field: 'date' | 'amount' | 'createdAt' | 'memberId' | 'paymentMethodId' | 'contributionTypeId',
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

  normalizeAmount(value: unknown): number {
    if (value == null) {
      return 0;
    }

    let raw = String(value).trim();
    if (!raw) {
      return 0;
    }

    raw = raw.replace(/R\$/g, '').replace(/\s/g, '');

    if (raw.includes(',')) {
      raw = raw.replace(/\./g, '').replace(',', '.');
    }

    const parsed = Number(raw);
    return Number.isNaN(parsed) ? 0 : parsed;
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

        this.dashboardService
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
            error: () => {
              this.toastService.error('Erro ao gerar relatório semanal.');
            },
          });
      });
  }
}

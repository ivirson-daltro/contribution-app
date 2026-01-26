import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import {
  DashboardSummary,
  MonthlyContribution,
  PaymentMethodPeriodTotals,
} from '../../models/dashboard-data.model';
import { Contribution } from '../../models/domain.model';
import { DashboardService } from '../../services/dashboard';
import { PaymentMethodChartComponent } from '../payment-method-chart/payment-method-chart';
import { MonthlyContributionsChartComponent } from '../monthly-contributions-chart/monthly-contributions-chart';
import { RecentContributionsTableComponent } from '../recent-contributions-table/recent-contributions-table';
import { SummaryCardComponent } from '../summary-card/summary-card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
    AsyncPipe,
    SummaryCardComponent,
    PaymentMethodChartComponent,
    MonthlyContributionsChartComponent,
    RecentContributionsTableComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);

  @ViewChild(RecentContributionsTableComponent)
  recentContributionsTable?: RecentContributionsTableComponent;

  dashboardSummary$: Observable<DashboardSummary> = this.dashboardService.getDashboardSummary();
  dashboardSummaryChart$?: Observable<PaymentMethodPeriodTotals[]> =
    this.dashboardService.getDashboardPaymentMethods();

  selectedPaymentPeriod: 'weekly' | 'monthly' = 'monthly';

  setPaymentPeriod(period: 'weekly' | 'monthly'): void {
    this.selectedPaymentPeriod = period;
  }

  refresh(): void {
    this.dashboardSummary$ = this.dashboardService.getDashboardSummary();
    this.dashboardSummaryChart$ = this.dashboardService.getDashboardPaymentMethods();

    this.recentContributionsTable?.refresh();
  }
}

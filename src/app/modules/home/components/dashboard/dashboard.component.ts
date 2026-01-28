import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { ListContributionsComponent } from '../../../contributions/components/list/list-contributions.component';
import { DashboardSummary, PaymentMethodPeriodTotals } from '../../models/dashboard-data.model';
import { DashboardService } from '../../services/dashboard.service';
import { MonthlyContributionsChartComponent } from './components/monthly-contributions-chart/monthly-contributions-chart.component';
import { PaymentMethodChartComponent } from './components/payment-method-chart/payment-method-chart.component';
import { SummaryCardComponent } from './components/summary-card/summary-card.component';

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
    ListContributionsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);

  @ViewChild(ListContributionsComponent)
  recentContributionsTable?: ListContributionsComponent;

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

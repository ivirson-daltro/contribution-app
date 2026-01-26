import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { DashboardSummary, PaymentMethodPeriodTotals } from '../../models/dashboard-data.model';
import { Contribution } from '../../models/domain.model';
import { DashboardService } from '../../services/dashboard';
import { PaymentMethodChartComponent } from '../payment-method-chart/payment-method-chart';
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
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  contributions: Contribution[] = [];
  dashboardSummary$!: Observable<DashboardSummary>;
  dashboardSummaryChart$?: Observable<PaymentMethodPeriodTotals[]>;
  selectedPaymentPeriod: 'weekly' | 'monthly' = 'monthly';

  ngOnInit(): void {
    this.dashboardSummary$ = this.dashboardService.getDashboardSummary();
    this.dashboardSummaryChart$ = this.dashboardService.getDashboardPaymentMethods();
  }

  setPaymentPeriod(period: 'weekly' | 'monthly'): void {
    this.selectedPaymentPeriod = period;
  }
}

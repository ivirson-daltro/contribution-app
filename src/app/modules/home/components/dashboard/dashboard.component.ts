import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { DashboardSummary, PaymentMethodPeriodTotals } from '../../models/dashboard-data.model';
import { DashboardService } from '../../services/dashboard.service';
import { MonthlyContributionsChartComponent } from './components/monthly-contributions-chart/monthly-contributions-chart.component';
import { PaymentMethodChartComponent } from './components/payment-method-chart/payment-method-chart.component';
import { SummaryCardComponent } from './components/summary-card/summary-card.component';
import { WeekType } from '../../constants/week-type.enum';

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
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);

  dashboardSummary$: Observable<DashboardSummary> = this.dashboardService.getDashboardSummary();
  dashboardSummaryChart$?: Observable<PaymentMethodPeriodTotals[]> =
    this.dashboardService.getDashboardPaymentMethods();

  selectedPaymentPeriod: WeekType = WeekType.CURRENT_WEEK;

  weekType = WeekType;

  setPaymentPeriod(period: WeekType): void {
    this.selectedPaymentPeriod = period;
  }
}

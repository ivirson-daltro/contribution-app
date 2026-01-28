import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { PaymentMethodPeriodTotals } from '../../../../models/dashboard-data.model';
import { Observable } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-payment-method-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-method-chart.component.html',
  styleUrls: ['./payment-method-chart.component.scss'],
})
export class PaymentMethodChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;

  @Input() totals: PaymentMethodPeriodTotals[] | null | undefined;
  @Input() period: 'weekly' | 'monthly' = 'monthly';

  dashboardSummaryChart?: PaymentMethodPeriodTotals[];

  private chart?: Chart<'bar'>;

  ngAfterViewInit(): void {
    this.buildChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const totalsChanged = !!changes['totals'] && !changes['totals'].firstChange;
    const periodChanged = !!changes['period'] && !changes['period'].firstChange;

    if (totalsChanged || periodChanged) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private buildChart(): void {
    if (!this.chartCanvas) {
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: this.buildData(),
      options: this.buildOptions(),
    };

    this.chart = new Chart<'bar'>(ctx, config);
  }

  private updateChart(): void {
    if (!this.chart) {
      this.buildChart();
      return;
    }

    this.chart.data = this.buildData();
    this.chart.update();
  }

  private buildData() {
    const items = this.totals ?? [];

    const labels = ['Entradas'];

    const currencyFormatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const datasets = items.map((item) => {
      const value = this.period === 'weekly' ? item.weeklyTotal : item.monthlyTotal;

      return {
        label: item.type,
        data: [value],
        backgroundColor: this.getColorForType(item.type),
        borderWidth: 0,
        datalabels: {
          anchor: 'center',
          align: 'center',
          color: '#ffffff',
          formatter: (val: number) => currencyFormatter.format(val),
        },
      } as any;
    });

    return {
      labels,
      datasets,
    };
  }

  private buildOptions(): ChartOptions<'bar'> {
    const currencyFormatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const label = ctx.dataset.label ?? '';
              const value = ctx.parsed.y ?? 0;
              return `${label}: ${currencyFormatter.format(value)}`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          ticks: {
            callback: (value) => currencyFormatter.format(Number(value)),
          },
        },
      },
    };

    return options;
  }

  private getColorForType(type: string): string {
    const normalized = type.toLowerCase();

    if (normalized.includes('pix')) {
      return '#f97316'; // laranja
    }

    if (normalized.includes('esp')) {
      return '#2563eb'; // azul
    }

    return '#64748b'; // cinza padrão
  }
}

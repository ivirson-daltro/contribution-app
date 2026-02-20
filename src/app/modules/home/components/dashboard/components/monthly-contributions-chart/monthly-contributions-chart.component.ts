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
import { MonthlyContribution } from '../../../../models/dashboard-data.model';

Chart.register(...registerables);

@Component({
  selector: 'app-monthly-contributions-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-contributions-chart.component.html',
  styleUrls: ['./monthly-contributions-chart.component.scss'],
})
export class MonthlyContributionsChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;

  @Input() monthlyData: MonthlyContribution[] | null | undefined;

  private chart?: Chart<'bar'>;

  ngAfterViewInit(): void {
    this.buildChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentChanged = !!changes['monthlyData'] && !changes['monthlyData'].firstChange;

    if (currentChanged) {
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
    const data = this.monthlyData ?? [];
    const labels = data.map((m) => m.month);
    const pix = data.map((m) => m.totalPix ?? 0);
    const cash = data.map((m) => m.totalCash ?? 0);
    const expenses = data.map((m) => m.totalExpenses ?? 0);

    return {
      labels,
      datasets: [
        {
          label: 'Entradas - Espécie',
          data: cash,
          backgroundColor: '#1E4E8C',
          borderWidth: 0,
          stack: 'entradas',
        },
        {
          label: 'Entradas - PIX',
          data: pix,
          backgroundColor: '#3BA55D',
          borderWidth: 0,
          stack: 'entradas',
        },
        {
          label: 'Despesas',
          data: expenses,
          backgroundColor: '#B71C1C',
          borderWidth: 0,
          stack: 'despesas',
        },
      ],
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
}

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

  @Input() currentYear: MonthlyContribution[] | null | undefined;
  @Input() lastYear: MonthlyContribution[] | null | undefined;

  private chart?: Chart<'bar'>;

  ngAfterViewInit(): void {
    this.buildChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentChanged = !!changes['currentYear'] && !changes['currentYear'].firstChange;
    const lastChanged = !!changes['lastYear'] && !changes['lastYear'].firstChange;

    if (currentChanged || lastChanged) {
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
    const current = this.currentYear ?? [];
    const last = this.lastYear ?? [];

    const labels = current.length ? current.map((m) => m.month) : last.map((m) => m.month);

    const getEntry = (source: MonthlyContribution[], month: string): MonthlyContribution | null => {
      return source.find((m) => m.month === month) ?? null;
    };

    const currentPix = labels.map((month) => getEntry(current, month)?.totalPix ?? 0);
    const currentCash = labels.map((month) => getEntry(current, month)?.totalCash ?? 0);
    const lastPix = labels.map((month) => getEntry(last, month)?.totalPix ?? 0);
    const lastCash = labels.map((month) => getEntry(last, month)?.totalCash ?? 0);

    return {
      labels,
      datasets: [
        {
          label: 'Espécie (ano atual)',
          data: currentCash,
          backgroundColor: '#2563eb',
          borderWidth: 0,
          stack: 'current',
        },
        {
          label: 'PIX (ano atual)',
          data: currentPix,
          backgroundColor: '#f97316',
          borderWidth: 0,
          stack: 'current',
        },
        {
          label: 'Espécie (ano anterior)',
          data: lastCash,
          backgroundColor: '#303030',
          borderWidth: 0,
          stack: 'last',
        },
        {
          label: 'PIX (ano anterior)',
          data: lastPix,
          backgroundColor: '#888888',
          borderWidth: 0,
          stack: 'last',
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

import { Component, Input } from '@angular/core';
import { CurrencyPipe, NgIf, NgStyle } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, NgStyle],
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
})
export class SummaryCardComponent {
  @Input() title = '';
  @Input() subtitle?: string | null;
  @Input() amount: number | string = 0;
  @Input() icon = '';
  @Input() bg = '#ffffff';
  @Input() iconBg = '#1933661a';
  @Input() iconColor = '#071a3d';
}

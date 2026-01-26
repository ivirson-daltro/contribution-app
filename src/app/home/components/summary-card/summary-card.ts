import { Component, Input } from '@angular/core';
import { CurrencyPipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.scss',
})
export class SummaryCardComponent {
  @Input() title = '';
  @Input() subtitle?: string | null;
  @Input() amount: number | string = 0;
  @Input() iconSrc = '';
  @Input() iconAlt = '';
}

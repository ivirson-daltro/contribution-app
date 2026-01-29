import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  styles: [
    `
      .global-loading-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1300;
      }

      .global-loading-spinner {
        width: 3rem;
        height: 3rem;
        border-width: 0.25rem;
        color: #ffffff;
      }
    `,
  ],
  template: `<router-outlet></router-outlet>
    @if (isLoading$ | async) {
      <div class="global-loading-overlay">
        <div class="global-loading-spinner spinner-border" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
      </div>
    }`,
})
export class AppComponent {
  readonly isLoading$ = inject(LoadingService).loading$;
}

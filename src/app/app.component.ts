import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
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

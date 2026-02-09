import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private activeRequests = 0;
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  show(): void {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      // Usamos microtask para evitar ExpressionChangedAfterItHasBeenCheckedError
      // quando o loading é disparado dentro de hooks de ciclo de vida (ex: ngOnInit)
      Promise.resolve().then(() => this.loadingSubject.next(true));
    }
  }

  hide(): void {
    if (this.activeRequests === 0) {
      return;
    }

    this.activeRequests--;
    if (this.activeRequests === 0) {
      Promise.resolve().then(() => this.loadingSubject.next(false));
    }
  }
}

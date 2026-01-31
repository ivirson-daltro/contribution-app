import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../auth/models/user.model';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user: User | null = this.getUserFromLocalStorage();
  isSidenavOpen = window.innerWidth > 991;

  closeSidenavOnMobile(): void {
    if (window.innerWidth <= 991) {
      this.isSidenavOpen = false;
    }
  }

  getUserFromLocalStorage(): User | null {
    try {
      const user = localStorage.getItem(environment.APP_USER_KEY);
      if (!user) return null;
      const parsed = JSON.parse(user);
      // Garante que tem os campos esperados
      if (typeof parsed === 'object' && parsed && parsed.role && parsed.name && parsed.email) {
        return parsed;
      }
      // Se inválido, limpa e força logout
      localStorage.removeItem(environment.APP_USER_KEY);
      return null;
    } catch {
      localStorage.removeItem(environment.APP_USER_KEY);
      return null;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}

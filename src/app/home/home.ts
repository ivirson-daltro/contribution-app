import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../auth/services/auth';
import { CadastrarContribuicaoComponent } from '../contributions/components/cadastrar/cadastrar-contribuicao';
import { CadastrarMembroComponent } from '../members/components/cadastrar/cadastrar-membro';
import { DashboardComponent } from './components/dashboard/dashboard';
import { Router } from '@angular/router';
import { User } from '../auth/models/user.model';

@Component({
  selector: 'app-home',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    DashboardComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @ViewChild(DashboardComponent)
  private dashboard?: DashboardComponent;

  user: User | null = this.getUserFromLocalStorage();

  openNewContribution(): void {
    const dialogRef = this.dialog.open(CadastrarContribuicaoComponent, {
      width: '720px',
      maxWidth: '95vw',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: unknown) => {
      if (result) {
        this.dashboard?.refresh();
      }
    });
  }

  openNewMember(): void {
    const dialogRef = this.dialog.open(CadastrarMembroComponent, {
      width: '720px',
      maxWidth: '95vw',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: unknown) => {
      if (result) {
        this.dashboard?.refresh();
      }
    });
  }

  getUserFromLocalStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

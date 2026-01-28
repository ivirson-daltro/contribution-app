import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../auth/services/auth.service';
import { AddContributionComponent } from '../contributions/components/add/add-contributions.component';
import { AddMembersComponent } from '../members/components/cadastrar/add-members.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Router } from '@angular/router';
import { User } from '../auth/models/user.model';
import { environment } from '../../environments/environment';

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
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @ViewChild(DashboardComponent)
  private dashboard?: DashboardComponent;

  user: User | null = this.getUserFromLocalStorage();

  openNewContribution(): void {
    const dialogRef = this.dialog.open(AddContributionComponent, {
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
    const dialogRef = this.dialog.open(AddMembersComponent, {
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
    const user = localStorage.getItem(environment.APP_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

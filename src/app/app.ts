import { AsyncPipe } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CadastrarContribuicaoComponent } from './contributions/components/cadastrar/cadastrar-contribuicao';
import { LoadingService } from './core/services/loading.service';
import { DashboardComponent } from './home/components/dashboard/dashboard';
import { CadastrarMembroComponent } from './members/components/cadastrar/cadastrar-membro';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    AsyncPipe,
    DashboardComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  protected readonly title = signal('app');
  readonly isLoading$ = inject(LoadingService).loading$;

  @ViewChild(DashboardComponent)
  private dashboard?: DashboardComponent;

  constructor(private dialog: MatDialog) {}

  openNewContribution(): void {
    const dialogRef = this.dialog.open(CadastrarContribuicaoComponent, {
      width: '720px',
      maxWidth: '95vw',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
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

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dashboard?.refresh();
      }
    });
  }
}

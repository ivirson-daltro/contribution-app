import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { first } from 'rxjs';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { ToastService } from '../../shared/services/toast.service';
import { User } from '../auth/models/user.model';
import { AddUsersComponent } from './components/add/add-users.component';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-users',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  private readonly usersService = inject(UsersService);
  private readonly dialog = inject(MatDialog);
  private readonly toastService = inject(ToastService);

  form!: FormGroup;

  users: User[] = [];
  totalUsers = 0;
  pageIndex = 0; // índice baseado em 0
  pageSize = 10;
  sortBy: 'name' | 'email' | 'role' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.getUserList();
  }

  openNewUser(): void {
    const dialogRef = this.dialog.open(AddUsersComponent, {
      width: '720px',
      maxWidth: '95vw',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: unknown) => {
      if (result) {
        this.getUserList();
      }
    });
  }

  getUserList(pageIndex: number = this.pageIndex, pageSize: number = this.pageSize): void {
    const page = pageIndex + 1; // API assumida como 1-based

    this.usersService
      .getPaginatedUsers(page, pageSize, this.sortBy, this.sortDirection)
      .pipe(first())
      .subscribe((res) => {
        if (!res) {
          this.users = [];
          this.totalUsers = 0;
          return;
        }

        this.users = res.data ?? [];
        this.totalUsers = res.total ?? 0;
        this.pageIndex = (res.page ?? page) - 1;
        this.pageSize = res.limit ?? pageSize;
      });
  }

  get totalPages(): number {
    return this.pageSize > 0 ? Math.ceil(this.totalUsers / this.pageSize) : 0;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index);
  }

  goToPage(pageIndex: number): void {
    if (pageIndex < 0 || pageIndex >= this.totalPages || pageIndex === this.pageIndex) {
      return;
    }

    this.pageIndex = pageIndex;
    this.getUserList(this.pageIndex, this.pageSize);
  }

  changeSort(field: 'name' | 'email' | 'role'): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }

    this.pageIndex = 0;
    this.getUserList(0, this.pageSize);
  }

  editUser(userId: string): void {
    this.usersService
      .getById(userId)
      .pipe(first())
      .subscribe({
        next: (user) => {
          const dialogRef = this.dialog.open(AddUsersComponent, {
            width: '720px',
            maxWidth: '95vw',
            autoFocus: false,
            data: user,
          });
          dialogRef.afterClosed().subscribe((result: unknown) => {
            if (result) {
              this.getUserList();
            }
          });
        },
        error: (error) => {
          this.toastService.error(
            error.error.error || 'Erro desconhecido',
            'Erro ao buscar dados do usuário',
          );
        },
      });
  }

  deleteUser(userId: string): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {
        title: 'Excluir Usuário',
        subtitle: 'Tem certeza que deseja excluir este usuário?',
        confirmLabel: 'Excluir',
        cancelLabel: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.onDeleteUser(userId);
      }
    });
  }

  onDeleteUser(userId: string): void {
    this.usersService
      .deleteUser(userId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastService.success('Usuário excluído com sucesso.');
          this.getUserList();
        },
        error: (error) => {
          this.toastService.error(
            error.error.error || 'Erro desconhecido',
            'Erro ao excluir o usuário',
          );
        },
      });
  }
}

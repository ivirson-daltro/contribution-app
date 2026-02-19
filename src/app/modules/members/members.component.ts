import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMaskPipe } from 'ngx-mask';
import { first } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { ToastService } from '../../shared/services/toast.service';
import { UserRoles } from '../users/constants/user-roles.enum';
import { User } from '../users/models/user.model';
import { AddMembersComponent } from './components/add/add-members.component';
import { MembersService } from './services/members.service';
import { Member } from './models/member.model';

@Component({
  selector: 'app-members',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    NgxMaskPipe,
    DatePipe,
  ],
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
  private readonly membersService = inject(MembersService);
  private readonly dialog = inject(MatDialog);
  private readonly toastService = inject(ToastService);

  form!: FormGroup;
  user: User | null = this.getUserFromLocalStorage();
  userRoles = UserRoles;

  name: string = '';

  members: Member[] = [];
  totalMembers = 0;
  pageIndex = 0; // índice baseado em 0
  pageSize = 10;
  sortBy: 'name' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.getMemberList();
  }

  getUserFromLocalStorage(): User | null {
    const user = localStorage.getItem(environment.APP_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  openNewMember(): void {
    const dialogRef = this.dialog.open(AddMembersComponent, {
      width: '720px',
      maxWidth: '95vw',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: unknown) => {
      if (result) {
        this.getMemberList();
      }
    });
  }

  searchByName(): void {
    this.membersService
      .getByName(this.name)
      .pipe(first())
      .subscribe({
        next: (res) => this.processMembersResponse(res, 1, this.pageSize),
        error: (error) => {
          this.toastService.error(
            error.error.error || 'Erro desconhecido',
            'Erro ao buscar lista de membros',
          );
        },
      });
  }

  getMemberList(pageIndex: number = this.pageIndex, pageSize: number = this.pageSize): void {
    const page = pageIndex + 1; // API assumida como 1-based
    this.membersService
      .getPaginatedMembers(page, pageSize, this.sortBy, this.sortDirection)
      .pipe(first())
      .subscribe({
        next: (res) => this.processMembersResponse(res, page, pageSize),
        error: (error) => {
          this.toastService.error(
            error.error.error || 'Erro desconhecido',
            'Erro ao buscar lista de membros',
          );
        },
      });
  }

  private processMembersResponse(res: any, fallbackPage: number, fallbackPageSize: number): void {
    if (!res) {
      this.members = [];
      this.totalMembers = 0;
      return;
    }
    this.members = res.data ?? [];
    this.totalMembers = res.total ?? 0;
    this.pageIndex = (res.page ?? fallbackPage) - 1;
    this.pageSize = res.limit ?? fallbackPageSize;
  }

  get totalPages(): number {
    return this.pageSize > 0 ? Math.ceil(this.totalMembers / this.pageSize) : 0;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index);
  }

  goToPage(pageIndex: number): void {
    if (pageIndex < 0 || pageIndex >= this.totalPages || pageIndex === this.pageIndex) {
      return;
    }

    this.pageIndex = pageIndex;
    this.getMemberList(this.pageIndex, this.pageSize);
  }

  changeSort(field: 'name'): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }

    this.pageIndex = 0;
    this.getMemberList(0, this.pageSize);
  }

  editMember(memberId: string): void {
    this.membersService
      .getById(memberId)
      .pipe(first())
      .subscribe({
        next: (member) => {
          const dialogRef = this.dialog.open(AddMembersComponent, {
            width: '720px',
            maxWidth: '95vw',
            autoFocus: false,
            data: member,
          });
          dialogRef.afterClosed().subscribe((result: unknown) => {
            if (result) {
              this.getMemberList();
            }
          });
        },
        error: (error) => {
          this.toastService.error(
            error.error.error || 'Erro desconhecido',
            'Erro ao buscar dados do membro',
          );
        },
      });
  }

  deleteMember(memberId: string): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {
        title: 'Excluir Membro',
        subtitle: 'Tem certeza que deseja excluir este membro?',
        confirmLabel: 'Excluir',
        cancelLabel: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.onDeleteMember(memberId);
      }
    });
  }

  onDeleteMember(memberId: string): void {
    this.membersService
      .deleteMember(memberId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastService.success('Membro excluído com sucesso.');
          this.getMemberList();
        },
        error: (error) => {
          this.toastService.error(
            error.error.error || 'Erro desconhecido',
            'Erro ao excluir o membro',
          );
        },
      });
  }

  limpar(): void {
    this.name = '';
    this.getMemberList(0, this.pageSize);
  }
}

import { Component, inject, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { first, map, Observable, startWith, switchMap } from 'rxjs';
import { ToastService } from '../../../../shared/services/toast.service';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { UserRoles } from '../../constants/user-roles.enum';
import { MembersService } from '../../../members/services/members.service';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Member } from '../../../members/models/member.model';

@Component({
  selector: 'app-add-users',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    AsyncPipe,
  ],
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss'],
})
export class AddUsersComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly toastService = inject(ToastService);
  private readonly membersService = inject(MembersService);

  form!: FormGroup;
  userRoles = UserRoles;

  members$: Observable<Member[]> = this.membersService.getMembers();
  filteredMembers$: Observable<Member[]> = new Observable<Member[]>();

  // Controle separado apenas para o texto digitado na busca de membro
  memberSearchControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    if (this.data) {
      this.form.patchValue({
        memberId: this.data.memberId ?? '',
      });
    }

    // Autocomplete: filtra membros conforme digita no campo de busca
    this.filteredMembers$ = this.memberSearchControl.valueChanges.pipe(
      startWith(''),
      switchMap((value) =>
        this.members$.pipe(
          map((members) => {
            const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
            if (!filterValue) return members;
            return members.filter((member) => member.name.toLowerCase().includes(filterValue));
          }),
        ),
      ),
    );
  }

  // Quando seleciona um membro no autocomplete, guarda o id no form
  onMemberSelected(member: Member): void {
    this.form.get('memberId')?.setValue(member.id);
    // Garante que o input mostre apenas o nome, sem disparar novo filtro
    this.memberSearchControl.setValue(member.name, { emitEvent: false });
  }

  buildForm(): void {
    this.form = this.fb.group({
      memberId: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  submit(): void {
    const userData = this.form.getRawValue();

    if (this.data && this.data.id) {
      this.updateUser(this.data.id, userData);
    } else {
      this.saveUser(userData);
    }
  }

  saveUser(userData: User): void {
    this.usersService
      .saveUser(userData)
      .pipe(first())
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.toastService.success('Usuário cadastrado com sucesso.');
        },
        error: (error) => {
          this.toastService.error(error?.error?.error ?? 'Erro ao cadastrar usuário.');
        },
      });
  }

  updateUser(id: string, userData: User): void {
    this.usersService
      .updateUser(id, userData)
      .pipe(first())
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.toastService.success('Usuário atualizado com sucesso.');
        },
        error: (error) => {
          this.toastService.error(error?.error?.error ?? 'Erro ao atualizar usuário.');
        },
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}

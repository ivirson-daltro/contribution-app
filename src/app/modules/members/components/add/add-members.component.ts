import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { first, Observable } from 'rxjs';
import { Member, MemberType } from '../../../home/models/domain.model';
import { MembersService } from '../../services/members.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-add-members',
  imports: [ReactiveFormsModule, MatDialogModule, MatIconModule, AsyncPipe],
  templateUrl: './add-members.component.html',
  styleUrls: ['./add-members.component.scss'],
})
export class AddMembersComponent implements OnInit {
  private readonly membersService = inject(MembersService);
  private readonly toastService = inject(ToastService);

  form!: FormGroup;

  memberTypes$: Observable<MemberType[]> = this.membersService.getMemberTypes();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Member | null,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    if (this.data) {
      this.form.patchValue({
        name: this.data.name ?? '',
        memberTypeId: this.data.memberTypeId ?? '',
      });
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      memberTypeId: ['', Validators.required],
    });
  }

  submit(): void {
    const memberData = this.form.getRawValue();

    if (this.data && this.data.id) {
      this.updateMember(this.data.id, memberData);
    } else {
      this.saveMember(memberData);
    }
  }

  saveMember(memberData: Member): void {
    this.membersService
      .saveMember(memberData)
      .pipe(first())
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.toastService.success('Membro cadastrado com sucesso.');
        },
        error: (error) => {
          this.toastService.error(error?.error?.error ?? 'Erro ao cadastrar membro.');
        },
      });
  }

  updateMember(id: string, memberData: Member): void {
    this.membersService
      .updateMember(id, memberData)
      .pipe(first())
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.toastService.success('Membro atualizado com sucesso.');
        },
        error: (error) => {
          this.toastService.error(error?.error?.error ?? 'Erro ao atualizar membro.');
        },
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}

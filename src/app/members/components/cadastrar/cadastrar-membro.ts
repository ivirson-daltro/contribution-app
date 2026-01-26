import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { first, Observable } from 'rxjs';
import { MemberType } from '../../../home/models/domain.model';
import { MembersService } from '../../services/members';

@Component({
  selector: 'app-cadastrar-membro',
  imports: [ReactiveFormsModule, MatDialogModule, MatIconModule, AsyncPipe],
  templateUrl: './cadastrar-membro.html',
  styleUrl: './cadastrar-membro.scss',
})
export class CadastrarMembroComponent implements OnInit {
  private readonly membersService = inject(MembersService);

  form!: FormGroup;

  memberTypes$: Observable<MemberType[]> = this.membersService.getMemberTypes();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CadastrarMembroComponent>,
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      memberTypeId: ['', Validators.required],
    });
  }

  submit(): void {
    this.saveMember();
  }

  saveMember(): void {
    const memberData = this.form.getRawValue();
    this.membersService
      .saveMember(memberData)
      .pipe(first())
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving member:', error);
        },
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}

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
import { NgxMaskDirective } from 'ngx-mask';
import { Address } from '../../models/address.model';

@Component({
  selector: 'app-add-members',
  imports: [ReactiveFormsModule, MatDialogModule, MatIconModule, AsyncPipe, NgxMaskDirective],
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
      // Garante que todos os campos do backend sejam populados corretamente
      const patch: Member = {
        id: this.data.id ?? '',
        name: this.data.name ?? '',
        memberTypeId: this.data.memberTypeId ?? null,
        memberType: this.data.memberType ?? null,
        phone: this.data.phone ?? undefined,
        email: this.data.email ?? undefined,
        genre: this.data.genre ?? undefined,
        birthDate: this.data.birthDate ?? undefined,
        entryDate: this.data.entryDate ?? undefined,
        baptismDate: this.data.baptismDate ?? undefined,
        zipCode: this.data.zipCode ?? undefined,
        street: this.data.street ?? undefined,
        number: this.data.number ?? undefined,
        complement: this.data.complement ?? undefined,
        city: this.data.city ?? undefined,
        state: this.data.state ?? undefined,
      };
      // Se memberType vier como objeto, pega o id
      if (this.data.memberType && this.data.memberType.id) {
        patch.memberTypeId = this.data.memberType.id;
      }
      this.form.patchValue(patch);
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: [null, Validators.required],
      memberTypeId: [null, Validators.required],
      phone: [null],
      email: [null],
      genre: [null],
      birthDate: [null],
      entryDate: [null],
      baptismDate: [null],
      zipCode: [null],
      street: [null],
      number: [null],
      complement: [null],
      city: [null],
      state: [null],
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

  onZipCodeChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const zipCode = input.value;
    if (zipCode && zipCode.length === 9) {
      this.getAddressByZipCode(zipCode);
    }
  }

  getAddressByZipCode(zipCode: string): void {
    this.membersService.getAddressByZipCode(zipCode).subscribe({
      next: (address: Address) => {
        this.form.patchValue({
          street: address.logradouro,
          complement: address.complemento,
          city: address.localidade,
          state: address.uf,
        });
      },
      error: () => {
        this.toastService.warning('Endereço não encontrado para o CEP informado.');
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}

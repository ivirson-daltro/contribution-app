import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { first, Observable } from 'rxjs';
import { ContributionType, Member, PaymentMethod } from '../../../home/models/domain.model';
import { ContributionsService } from '../../services/contributions.service';

@Component({
  selector: 'app-add-contributions',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatIconModule, AsyncPipe],
  templateUrl: './add-contributions.component.html',
  styleUrls: ['./add-contributions.component.scss'],
})
export class AddContributionComponent implements OnInit {
  private readonly contributionsService = inject(ContributionsService);

  form!: FormGroup;

  members$: Observable<Member[]> = this.contributionsService.getMembers();
  contributionTypes$: Observable<ContributionType[]> =
    this.contributionsService.getContributionTypes();
  paymentMethods$: Observable<PaymentMethod[]> = this.contributionsService.getPaymentMethods();

  private contributionTypesCache: ContributionType[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddContributionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadContributionTypes();
    this.setupMemberValidation();

    if (this.data) {
      // Aguarda todos os selects carregarem antes de preencher
      Promise.all([
        this.members$.pipe(first()).toPromise(),
        this.contributionTypes$.pipe(first()).toPromise(),
        this.paymentMethods$.pipe(first()).toPromise(),
      ]).then(() => {
        this.form.patchValue({
          memberId: this.data.memberId ?? '',
          contributionTypeId: this.data.contributionTypeId ?? '',
          paymentMethodId: this.data.paymentMethodId ?? '',
          amount: this.data.amount ?? '',
          date: this.data.date ? this.data.date.substring(0, 10) : '',
          observation: this.data.observation ?? '',
        });
        this.formatAmount();
      });
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      memberId: ['', Validators.required],
      contributionTypeId: ['', Validators.required],
      paymentMethodId: ['', Validators.required],
      amount: ['', [Validators.required]],
      date: ['', Validators.required],
      observation: [''],
    });
  }

  submit(): void {
    this.saveContribution();
  }

  saveContribution(): void {
    const raw = this.form.getRawValue();
    const amount = this.parseAmount(raw.amount);
    const contributionData = {
      ...raw,
      amount,
    };
    if (this.data && this.data.id) {
      // Edição
      this.contributionsService
        .updateContribution(this.data.id, contributionData)
        .pipe(first())
        .subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating contribution:', error);
          },
        });
    } else {
      // Novo
      this.contributionsService
        .saveContribution(contributionData)
        .pipe(first())
        .subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error saving contribution:', error);
          },
        });
    }
  }

  formatAmount(): void {
    const control = this.form.get('amount');
    if (!control) {
      return;
    }

    const formatted = this.formatCurrency(control.value);
    if (formatted) {
      control.setValue(formatted, { emitEvent: false });
    }
  }

  private parseAmount(value: unknown): number {
    const parsed = this.toNumber(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private formatCurrency(value: unknown): string {
    const parsed = this.toNumber(value);
    if (Number.isNaN(parsed)) {
      return '';
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parsed);
  }

  private loadContributionTypes(): void {
    this.contributionTypes$.pipe(first()).subscribe((types) => {
      this.contributionTypesCache = types ?? [];
    });
  }

  private setupMemberValidation(): void {
    const memberControl = this.form.get('memberId');
    const typeControl = this.form.get('contributionTypeId');

    if (!memberControl || !typeControl) {
      return;
    }

    typeControl.valueChanges.subscribe((typeId: string) => {
      const isOferta = this.isOfertaType(typeId);

      if (isOferta) {
        memberControl.clearValidators();
      } else {
        memberControl.setValidators([Validators.required]);
      }

      memberControl.updateValueAndValidity();
    });
  }

  private isOfertaType(typeId: string | null | undefined): boolean {
    if (!typeId) {
      return false;
    }

    const type = this.contributionTypesCache.find((t) => t.id === typeId);
    return !!type && type.description?.toLowerCase() === 'oferta';
  }

  private toNumber(value: unknown): number {
    if (value == null) {
      return NaN;
    }

    let raw = String(value).trim();
    if (!raw) {
      return NaN;
    }

    // Remove prefix e espaços
    raw = raw.replace(/R\$/g, '').replace(/\s/g, '');

    // Se já tiver vírgula (formato brasileiro) consideramos que já veio com casas decimais
    if (raw.includes(',')) {
      raw = raw.replace(/\./g, '').replace(',', '.');
      return Number(raw);
    }

    // Se não tiver vírgula, tratamos como sequência de dígitos
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      return NaN;
    }

    if (digits.length <= 2) {
      // 1 -> 1,00  |  10 -> 10,00
      return Number(digits);
    }

    // 100 -> 1,00  |  1000 -> 10,00  |  50007 -> 500,07
    const intPart = digits.slice(0, digits.length - 2);
    const fracPart = digits.slice(-2);
    return Number(`${intPart}.${fracPart}`);
  }

  close(): void {
    this.dialogRef.close();
  }
}

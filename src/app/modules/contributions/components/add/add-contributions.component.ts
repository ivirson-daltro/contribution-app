import { AsyncPipe } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';
import { first, Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import {
  Contribution,
  ContributionType,
  Member,
  PaymentMethod,
} from '../../../home/models/domain.model';
import { AddMembersComponent } from '../../../members/components/add/add-members.component';
import { MembersService } from '../../../members/services/members.service';
import { ContributionsService } from '../../services/contributions.service';

@Component({
  selector: 'app-add-contributions',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    AsyncPipe,
    NgxMaskDirective,
  ],
  templateUrl: './add-contributions.component.html',
  styleUrls: ['./add-contributions.component.scss'],
})
export class AddContributionComponent implements OnInit {
  private readonly contributionsService = inject(ContributionsService);
  private readonly membersService = inject(MembersService);
  private readonly dialog = inject(MatDialog);

  form!: FormGroup;

  members$: Observable<Member[]> = this.membersService.getMembers();
  filteredMembers$: Observable<Member[]> = new Observable<Member[]>();
  contributionTypes$: Observable<ContributionType[]> =
    this.contributionsService.getContributionTypes();
  paymentMethods$: Observable<PaymentMethod[]> = this.contributionsService.getPaymentMethods();

  private contributionTypesCache: ContributionType[] = [];

  today = new Date();
  maxDate: string = this.today.toISOString().substring(0, 10);

  // Controle separado apenas para o texto digitado na busca de membro
  memberSearchControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddContributionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadContributionTypes();
    this.setupMemberValidation();

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

    // Formata o valor ao sair do campo
    this.form.get('amount')?.valueChanges.subscribe((value) => {
      if (value != null && value !== '') {
        const formatted = this.formatAmountString(value);
        if (formatted !== value) {
          this.form.get('amount')?.setValue(formatted, { emitEvent: false });
        }
      }
    });

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

        // Preenche o texto da busca com o nome do membro selecionado (edição)
        if (this.data.memberId) {
          this.members$.pipe(first()).subscribe((members) => {
            const found = members.find((m) => m.id === this.data.memberId);
            if (found) {
              this.memberSearchControl.setValue(found.name, { emitEvent: false });
            }
          });
        }
      });
    }
  }

  // Quando seleciona um membro no autocomplete, guarda o id no form
  onMemberSelected(member: Member): void {
    this.form.get('memberId')?.setValue(member.id);
    // Garante que o input mostre apenas o nome, sem disparar novo filtro
    this.memberSearchControl.setValue(member.name, { emitEvent: false });
  }

  private formatAmountString(value: string): string {
    if (!value) return '';
    // Remove prefixo e espaços
    let raw = value.replace(/R\$/g, '').replace(/\s/g, '');
    // Se já tem vírgula, respeita as casas decimais digitadas
    if (raw.includes(',')) {
      const [int, dec] = raw.split(',');
      if (dec && dec.length === 2) return `R$ ${int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${dec}`;
      if (dec && dec.length === 1) return `R$ ${int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${dec}0`;
      return `R$ ${int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},00`;
    }
    // Se não tem vírgula, adiciona ,00
    return `R$ ${raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},00`;
  }

  buildForm(): void {
    this.form = this.fb.group({
      memberId: ['', Validators.required],
      contributionTypeId: ['', Validators.required],
      paymentMethodId: ['', Validators.required],
      amount: ['', [Validators.required]],
      date: [this.today.toISOString().substring(0, 10), Validators.required],
      observation: [''],
    });
  }

  submit(): void {
    const raw = this.form.getRawValue();
    // O valor de amount já virá limpo pelo ngx-mask (ex: 1234.56)
    const payload: Contribution = {
      ...raw,
      amount:
        typeof raw.amount === 'string' ? parseFloat(raw.amount.replace(',', '.')) : raw.amount,
    };
    if (this.data && this.data.id) {
      this.updateContribution(payload);
    } else {
      this.saveContribution(payload);
    }
  }

  updateContribution(contributionData: Contribution): void {
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
  }

  saveContribution(contributionData: Contribution): void {
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

  onAmountBlur(): void {
    const control = this.form.get('amount');
    if (!control) return;
    let value = control.value;
    if (!value) return;
    // Remove prefixo e espaços
    value = String(value).replace(/R\$/g, '').replace(/\s/g, '');
    // Se já tem vírgula, ajusta casas decimais
    if (value.includes(',')) {
      const [int, dec] = value.split(',');
      if (dec && dec.length === 2) {
        control.setValue(`R$ ${int},${dec}`);
      } else if (dec && dec.length === 1) {
        control.setValue(`R$ ${int},${dec}0`);
      } else {
        control.setValue(`R$ ${int},00`);
      }
    } else {
      // Não tem vírgula, adiciona ,00
      control.setValue(`R$ ${value},00`);
    }
  }

  openNewMember(): void {
    const dialogRef = this.dialog.open(AddMembersComponent, {
      width: '720px',
      maxWidth: '95vw',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: unknown) => {
      if (result) {
        this.members$ = this.membersService.getMembers().pipe(first());
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}

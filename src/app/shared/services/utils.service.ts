import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private readonly httpClient = inject(HttpClient);
  /**
   * Normaliza um valor monetário, removendo símbolos de moeda, espaços e convertendo vírgulas para pontos.
   * @param value valor monetário a ser normalizado
   * @returns valor monetário formatado para o padrão brasileiro
   */
  normalizeAmount(value: unknown): number {
    if (value == null) {
      return 0;
    }

    let raw = String(value).trim();
    if (!raw) {
      return 0;
    }

    raw = raw.replace(/R\$/g, '').replace(/\s/g, '');

    if (raw.includes(',')) {
      raw = raw.replace(/\./g, '').replace(',', '.');
    }

    const parsed = Number(raw);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  /**
   *  Formata um valor monetário para o padrão brasileiro, adicionando o prefixo "R$" e formatando as casas decimais.
   * @param form Formulário que contém o campo de valor monetário
   * @returns void
   */
  onAmountBlur(form: FormGroup, controlName: string): void {
    const control = form.get(controlName);
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

  downloadAttachment(url: string): Observable<Blob> {
    return this.httpClient.get(url, { responseType: 'blob' });
  }
}

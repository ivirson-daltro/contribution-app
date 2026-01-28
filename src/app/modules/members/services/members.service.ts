import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Member, MemberType } from '../../home/models/domain.model';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly httpClient = inject(HttpClient);

  getMemberTypes(): Observable<MemberType[]> {
    return this.httpClient.get<MemberType[]>(`${environment.apiUrl}/domain/member-types`);
  }

  saveMember(memberData: Member): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiUrl}/members`, memberData);
  }
}

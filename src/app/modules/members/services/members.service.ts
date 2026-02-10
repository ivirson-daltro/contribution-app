import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Member, MemberType, PaginatedResponse } from '../../home/models/domain.model';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly httpClient = inject(HttpClient);

  getMemberTypes(): Observable<MemberType[]> {
    return this.httpClient.get<MemberType[]>(`${environment.apiUrl}/domain/member-types`);
  }

  getMembers(): Observable<Member[]> {
    return this.httpClient.get<Member[]>(`${environment.apiUrl}/members`);
  }

  getPaginatedMembers(
    page = 1,
    limit = 10,
    sortBy?: 'name',
    sortDirection: 'asc' | 'desc' = 'asc',
  ): Observable<PaginatedResponse<Member>> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (sortBy) {
      params = params.set('sortBy', sortBy).set('sortDirection', sortDirection);
    }
    return this.httpClient.get<PaginatedResponse<Member>>(
      `${environment.apiUrl}/members/paginated`,
      { params },
    );
  }

  saveMember(memberData: Member): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiUrl}/members`, memberData);
  }

  getById(memberId: string): Observable<Member> {
    return this.httpClient.get<Member>(`${environment.apiUrl}/members/${memberId}`);
  }

  getByName(name: string): Observable<PaginatedResponse<Member>> {
    return this.httpClient.get<PaginatedResponse<Member>>(
      `${environment.apiUrl}/members/search?q=${name}`,
    );
  }

  updateMember(memberId: string, memberData: Member): Observable<void> {
    return this.httpClient.put<void>(`${environment.apiUrl}/members/${memberId}`, memberData);
  }

  deleteMember(memberId: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/members/${memberId}`);
  }

  getAddressByZipCode(zipCode: string): Observable<any> {
    return this.httpClient.get<any>(`https://viacep.com.br/ws/${zipCode}/json/`);
  }
}

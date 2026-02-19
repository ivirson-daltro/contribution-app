import { MemberType } from '../../parameters/models/parameters.models';

export interface Member {
  id: string;
  name: string;
  memberTypeId: string;
  memberType: MemberType;
  phone?: string;
  email?: string;
  genre?: string;
  birthDate?: string;
  entryDate?: string;
  baptismDate?: string;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  city?: string;
  state?: string;
}

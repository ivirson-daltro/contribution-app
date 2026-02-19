import { Member } from '../../members/models/member.model';
import { UserRoles } from '../constants/user-roles.enum';

export interface User {
  id: string;
  memberId: string;
  member?: Member;
  password: string;
  role: UserRoles;
}

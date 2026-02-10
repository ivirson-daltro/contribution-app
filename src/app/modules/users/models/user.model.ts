import { Member } from '../../home/models/domain.model';
import { UserRoles } from '../constants/user-roles.enum';

export interface User {
  id: string;
  memberId: string;
  member?: Member;
  password: string;
  role: UserRoles;
}

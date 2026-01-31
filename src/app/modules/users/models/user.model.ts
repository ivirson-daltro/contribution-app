import { UserRoles } from '../constants/user-roles.enum';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRoles;
}

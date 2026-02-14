export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  offset: number;
  data: T[];
}

export interface Contribution {
  id: string;
  memberId?: string;
  member?: Member;
  contributionTypeId: string;
  contributionType: ContributionType;
  paymentMethodId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  date: string;
  observation?: string;
  createdAt: string;
  attachmentUrl?: string;
}

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

export interface MemberType {
  id: string;
  description: string;
}

export interface ContributionType {
  id: string;
  description: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  description: string;
}

import { Member } from '../../members/models/member.model';
import { ContributionType, PaymentMethod } from '../../parameters/models/parameters.models';

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

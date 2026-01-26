export interface DashboardSummary {
  totalContributions: number;
  totalWeeklyContributions: number;
  totalMonthlyContributions: number;
  totalAmount: number;
  totalWeeklyAmount: number;
  totalMonthlyAmount: number;
  totalMembers: number;
  totalMembersContributing: number;
  contributionsByPaymentMethod: ContributionByPaymentMethod[];
}

export interface ContributionByPaymentMethod {
  type: string;
  description: string;
  total: number;
}

export interface PaymentMethodPeriodTotals {
  paymentMethodId: string;
  type: string;
  description: string;
  weeklyTotal: number;
  monthlyTotal: number;
}

export interface DashboardSummary {
  totalContributions: number;
  totalWeeklyContributions: number;
  totalMonthlyContributions: number;
  totalLastWeekContributions: number;
  totalLastWeekAmount: number;
  totalAmount: number;
  totalWeeklyAmount: number;
  totalMonthlyAmount: number;
  totalMembers: number;
  totalMembersContributing: number;
  contributionsByPaymentMethod: ContributionByPaymentMethod[];
  currentYearContributionsByMonth: MonthlyContribution[];
  lastYearContributionsByMonth: MonthlyContribution[];
}

export interface MonthlyContribution {
  month: string;
  totalPix: number;
  totalCash: number;
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
  currentWeekTotal: number;
  currentMonthTotal: number;
  lastWeekTotal: number;
}

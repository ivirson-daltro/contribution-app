export interface DashboardSummary {
  contributionsByPaymentMethod: ContributionByPaymentMethod[];
  currentYearContributionsByMonth: MonthlyContribution[];
  lastYearContributionsByMonth: MonthlyContribution[];
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
  totalMonthlyExpenses: number;
  totalYearlyExpenses: number;
  totalWeeklyExpenses: number;
  totalWeeklyExpensesCount: number;
  totalMonthlyExpensesCount: number;
  totalYearlyExpensesCount: number;
  totalConstructionOffers: number;
  totalConstructionOfferAmount: number;
}

export interface MonthlyContribution {
  month: string;
  totalPix: number;
  totalCash: number;
  totalExpenses: number;
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

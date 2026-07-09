export type PaymentMethod = 'Cash' | 'M-Pesa';

export interface Loan {
  id: string;
  customerId: string;
  amountBorrowed: number;
  interestAmount: number;
  processingFee: number;
  totalRepayment: number;
  dailyRepayment: number;
  remainingBalance: number;
  startDate: string;
  status: 'Active' | 'Completed' | 'Overdue';
}

export interface Payment {
  id: string;
  customerId: string;
  loanId: string;
  amount: number;
  method: PaymentMethod;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  activeLoanId?: string;
}

export interface Expense {
  id: string;
  name: string;
  category: 'Store' | 'Daily' | 'Other';
  amount: number;
  method: PaymentMethod;
  date: string;
}

export interface IncomeRecord {
  id: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  type: 'Loan Repayment';
  customerId: string;
}

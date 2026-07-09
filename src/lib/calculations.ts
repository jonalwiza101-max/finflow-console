import { Loan } from '../types';

export const LOAN_INTEREST_RATE = 0.20; // 20%
export const PROCESSING_FEE_RATE = 0.10; // 10%
export const LOAN_PERIOD_DAYS = 30;

export const calculateLoanDetails = (amount: number) => {
  const interestAmount = amount * LOAN_INTEREST_RATE;
  const processingFee = amount * PROCESSING_FEE_RATE;
  const totalRepayment = amount + interestAmount;
  const dailyRepayment = totalRepayment / LOAN_PERIOD_DAYS;

  return {
    interestAmount,
    processingFee,
    totalRepayment,
    dailyRepayment,
  };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
  }).format(amount);
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Loan, Payment, Expense, IncomeRecord } from '../types';
import { calculateLoanDetails } from '../lib/calculations';

interface AppContextType {
  customers: Customer[];
  loans: Loan[];
  payments: Payment[];
  expenses: Expense[];
  addCustomer: (name: string, phone: string, loanAmount: number) => void;
  recordPayment: (customerId: string, loanId: string, amount: number, method: 'Cash' | 'M-Pesa') => void;
  addExpense: (name: string, category: Expense['category'], amount: number, method: 'Cash' | 'M-Pesa') => void;
  getDashboardStats: () => {
    todayExpected: number;
    todayCollected: number;
    todayUncollected: number;
    mainBalance: number;
    cashBalance: number;
    mPesaBalance: number;
  };
  getRepaymentHistory: (customerId: string) => Payment[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem('loans');
    return saved ? JSON.parse(saved) : [];
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('payments');
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('loans', JSON.stringify(loans));
    localStorage.setItem('payments', JSON.stringify(payments));
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [customers, loans, payments, expenses]);

  const addCustomer = (name: string, phone: string, loanAmount: number) => {
    const customerId = crypto.randomUUID();
    const loanId = crypto.randomUUID();
    const { interestAmount, processingFee, totalRepayment, dailyRepayment } = calculateLoanDetails(loanAmount);

    const newCustomer: Customer = {
      id: customerId,
      name,
      phone,
      activeLoanId: loanId,
    };

    const newLoan: Loan = {
      id: loanId,
      customerId,
      amountBorrowed: loanAmount,
      interestAmount,
      processingFee,
      totalRepayment,
      dailyRepayment,
      remainingBalance: totalRepayment,
      startDate: new Date().toISOString(),
      status: 'Active',
    };

    setCustomers([...customers, newCustomer]);
    setLoans([...loans, newLoan]);
  };

  const recordPayment = (customerId: string, loanId: string, amount: number, method: 'Cash' | 'M-Pesa') => {
    const paymentId = crypto.randomUUID();
    const newPayment: Payment = {
      id: paymentId,
      customerId,
      loanId,
      amount,
      method,
      date: new Date().toISOString(),
    };

    setPayments([...payments, newPayment]);

    setLoans(prevLoans => prevLoans.map(loan => {
      if (loan.id === loanId) {
        const newBalance = loan.remainingBalance - amount;
        return {
          ...loan,
          remainingBalance: newBalance,
          status: newBalance <= 0 ? 'Completed' : loan.status
        };
      }
      return loan;
    }));
  };

  const addExpense = (name: string, category: Expense['category'], amount: number, method: 'Cash' | 'M-Pesa') => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      name,
      category,
      amount,
      method,
      date: new Date().toISOString(),
    };
    setExpenses([...expenses, newExpense]);
  };

  const getDashboardStats = () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Today's Expected: Sum of dailyRepayment for all active loans
    const todayExpected = loans
      .filter(l => l.status === 'Active')
      .reduce((sum, l) => sum + l.dailyRepayment, 0);

    // Today's Collected: Sum of payments made today
    const todayCollected = payments
      .filter(p => p.date.startsWith(today))
      .reduce((sum, p) => sum + p.amount, 0);

    const todayUncollected = Math.max(0, todayExpected - todayCollected);

    // Financial Balances
    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const cashIncome = payments.filter(p => p.method === 'Cash').reduce((sum, p) => sum + p.amount, 0);
    const mPesaIncome = payments.filter(p => p.method === 'M-Pesa').reduce((sum, p) => sum + p.amount, 0);
    
    const cashExpenses = expenses.filter(e => e.method === 'Cash').reduce((sum, e) => sum + e.amount, 0);
    const mPesaExpenses = expenses.filter(e => e.method === 'M-Pesa').reduce((sum, e) => sum + e.amount, 0);

    const cashBalance = cashIncome - cashExpenses;
    const mPesaBalance = mPesaIncome - mPesaExpenses;
    const mainBalance = cashBalance + mPesaBalance;

    return {
      todayExpected,
      todayCollected,
      todayUncollected,
      mainBalance,
      cashBalance,
      mPesaBalance
    };
  };

  const getRepaymentHistory = (customerId: string) => {
    return payments.filter(p => p.customerId === customerId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <AppContext.Provider value={{ 
      customers, 
      loans, 
      payments, 
      expenses, 
      addCustomer, 
      recordPayment, 
      addExpense,
      getDashboardStats,
      getRepaymentHistory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

import React from 'react';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { formatCurrency } from '@/lib/calculations';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const { customers, loans, expenses, payments, getDashboardStats } = useAppContext();
  const stats = getDashboardStats();

  const collectionRate = stats.todayExpected > 0 
    ? (stats.todayCollected / stats.todayExpected) * 100 
    : 0;

  const summaryCards = [
    {
      title: 'Customers',
      value: customers.length,
      icon: Users,
      description: 'Active clients',
      color: 'bg-blue-500',
    },
    {
      title: 'Loans',
      value: loans.filter(l => l.status === 'Active').length,
      icon: Wallet,
      description: 'Active loans',
      color: 'bg-indigo-500',
    },
    {
      title: 'Main Balance',
      value: formatCurrency(stats.mainBalance),
      icon: DollarSign,
      description: 'Cash + M-Pesa',
      color: 'bg-emerald-500',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0)),
      icon: TrendingDown,
      description: 'All time',
      color: 'bg-rose-500',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Financial overview and daily collections.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="overflow-hidden border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`${card.color} p-2 rounded-lg text-white`}>
                <card.icon size={18} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Daily Collection Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Daily Collection Dashboard</CardTitle>
              <Target className="text-primary" size={20} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Expected Today</span>
                <div className="text-xl font-bold text-primary">{formatCurrency(stats.todayExpected)}</div>
              </div>
              <div className="space-y-2 border-l sm:pl-6">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Collected Today</span>
                <div className="text-xl font-bold text-emerald-600">{formatCurrency(stats.todayCollected)}</div>
              </div>
              <div className="space-y-2 border-l sm:pl-6">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Uncollected</span>
                <div className="text-xl font-bold text-rose-500">{formatCurrency(stats.todayUncollected)}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Collection Progress</span>
                <span>{collectionRate.toFixed(1)}%</span>
              </div>
              <Progress value={collectionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
             <CardTitle className="text-lg">Main Balance Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-emerald-100 text-emerald-700 rounded-md">
                      <DollarSign size={16} />
                   </div>
                   <span className="text-sm font-medium">Cash Balance</span>
                </div>
                <span className="font-bold">{formatCurrency(stats.cashBalance)}</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-100 text-blue-700 rounded-md">
                      <Wallet size={16} />
                   </div>
                   <span className="text-sm font-medium">M-Pesa Balance</span>
                </div>
                <span className="font-bold">{formatCurrency(stats.mPesaBalance)}</span>
             </div>
             <div className="pt-2 border-t mt-4">
                <div className="flex items-center justify-between">
                   <span className="text-sm text-muted-foreground">Total Income</span>
                   <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                      <ArrowUpRight size={14} />
                      {formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))}
                   </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                   <span className="text-sm text-muted-foreground">Total Expenses</span>
                   <span className="text-sm font-medium text-rose-500 flex items-center gap-1">
                      <ArrowDownRight size={14} />
                      {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}
                   </span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Mock or List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         <Card className="lg:col-span-1 shadow-md">
            <CardHeader>
               <CardTitle className="text-lg">Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div className="p-3 border rounded-lg bg-background">
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-semibold">Payment Reminder</span>
                        <span className="text-[10px] text-muted-foreground">Today</span>
                     </div>
                     <p className="text-xs text-muted-foreground line-clamp-2">Dear Juma, this is a reminder for your daily repayment of TSh 4,333.</p>
                  </div>
                  <div className="p-3 border rounded-lg bg-background">
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-semibold">Loan Approved</span>
                        <span className="text-[10px] text-muted-foreground">Yesterday</span>
                     </div>
                     <p className="text-xs text-muted-foreground line-clamp-2">Congratulations Mary, your loan application has been approved.</p>
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card className="lg:col-span-2 shadow-md">
            <CardHeader>
               <CardTitle className="text-lg">Recent Collections</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {payments.slice(0, 5).length > 0 ? (
                    payments.slice(0, 5).map((payment) => {
                      const customer = customers.find(c => c.id === payment.customerId);
                      return (
                        <div key={payment.id} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-md transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                              {customer?.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{customer?.name}</div>
                              <div className="text-xs text-muted-foreground">{payment.method} • {new Date(payment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                          </div>
                          <div className="text-sm font-bold text-emerald-600">
                            + {formatCurrency(payment.amount)}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm italic">
                       No collections recorded yet today.
                    </div>
                  )}
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default Dashboard;

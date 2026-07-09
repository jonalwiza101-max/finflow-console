import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight,
  Calendar,
  BarChart3
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { formatCurrency } from '@/lib/calculations';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Income = () => {
  const { payments, customers } = useAppContext();

  const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);
  const cashIncome = payments.filter(p => p.method === 'Cash').reduce((sum, p) => sum + p.amount, 0);
  const mPesaIncome = payments.filter(p => p.method === 'M-Pesa').reduce((sum, p) => sum + p.amount, 0);

  // Group by month for simple "monthly report"
  const monthlyData = payments.reduce((acc: any, p) => {
    const month = new Date(p.date).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = 0;
    acc[month] += p.amount;
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Income Analysis</h1>
        <p className="text-muted-foreground">Detailed breakdown of loan repayments and revenue.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
         <Card className="shadow-sm border-none bg-emerald-50 text-emerald-900">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
            </CardContent>
         </Card>
         <Card className="shadow-sm border-none bg-emerald-600 text-white">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Cash Collections</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{formatCurrency(cashIncome)}</div>
            </CardContent>
         </Card>
         <Card className="shadow-sm border-none bg-blue-600 text-white">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">M-Pesa Collections</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{formatCurrency(mPesaIncome)}</div>
            </CardContent>
         </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
         <div className="flex items-center justify-between mb-4">
            <TabsList>
               <TabsTrigger value="all">Daily Records</TabsTrigger>
               <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
            </TabsList>
         </div>

         <TabsContent value="all">
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
               <Table>
                  <TableHeader>
                     <TableRow className="bg-muted/30">
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {payments.length > 0 ? (
                        [...payments].reverse().map((payment) => {
                           const customer = customers.find(c => c.id === payment.customerId);
                           return (
                              <TableRow key={payment.id}>
                                 <TableCell className="text-muted-foreground">
                                    {new Date(payment.date).toLocaleDateString()}
                                 </TableCell>
                                 <TableCell className="font-medium">{customer?.name || 'Unknown'}</TableCell>
                                 <TableCell>
                                    <div className="flex items-center gap-1.5 text-sm">
                                       <div className={`w-2 h-2 rounded-full ${payment.method === 'Cash' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                       {payment.method}
                                    </div>
                                 </TableCell>
                                 <TableCell className="text-right font-bold text-emerald-600">
                                    + {formatCurrency(payment.amount)}
                                 </TableCell>
                              </TableRow>
                           );
                        })
                     ) : (
                        <TableRow>
                           <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                              No income records yet.
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </div>
         </TabsContent>

         <TabsContent value="monthly">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {Object.keys(monthlyData).length > 0 ? (
                  Object.entries(monthlyData).map(([month, amount]: any) => (
                     <Card key={month} className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                           <CardTitle className="text-sm font-medium">{month}</CardTitle>
                           <BarChart3 size={16} className="text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                           <div className="text-xl font-bold">{formatCurrency(amount)}</div>
                           <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                              <ArrowUpRight size={12} />
                              Repayments
                           </p>
                        </CardContent>
                     </Card>
                  ))
               ) : (
                  <div className="col-span-full py-12 text-center text-muted-foreground italic">
                     No monthly data available yet.
                  </div>
               )}
            </div>
         </TabsContent>
      </Tabs>
    </div>
  );
};

export default Income;

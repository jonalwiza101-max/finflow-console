import React, { useState } from 'react';
import { 
  Wallet, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  DollarSign
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
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Loans = () => {
  const { loans, customers } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const activeLoans = loans.filter(l => l.status === 'Active');
  const completedLoans = loans.filter(l => l.status === 'Completed');
  const overdueLoans = loans.filter(l => l.status === 'Overdue');

  const filteredLoans = loans.filter(l => {
    const customer = customers.find(c => c.id === l.customerId);
    return customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Active</Badge>;
      case 'Completed':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Completed</Badge>;
      case 'Overdue':
        return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Loans Management</h1>
        <p className="text-muted-foreground">Monitor all issued loans and repayment statuses.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
         <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
               <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
               <Clock size={16} className="text-blue-500" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{activeLoans.length}</div>
            </CardContent>
         </Card>
         <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
               <CardTitle className="text-sm font-medium">Completed</CardTitle>
               <CheckCircle2 size={16} className="text-emerald-500" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{completedLoans.length}</div>
            </CardContent>
         </Card>
         <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
               <CardTitle className="text-sm font-medium">Overdue</CardTitle>
               <AlertCircle size={16} className="text-rose-500" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{overdueLoans.length}</div>
            </CardContent>
         </Card>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search customer name..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Customer</TableHead>
              <TableHead>Principal</TableHead>
              <TableHead>Interest (20%)</TableHead>
              <TableHead>Processing Fee (10%)</TableHead>
              <TableHead>Total Repayment</TableHead>
              <TableHead>Daily Rate</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoans.length > 0 ? (
              filteredLoans.map((loan) => {
                const customer = customers.find(c => c.id === loan.customerId);
                return (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{customer?.name}</TableCell>
                    <TableCell>{formatCurrency(loan.amountBorrowed)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatCurrency(loan.interestAmount)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatCurrency(loan.processingFee)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(loan.totalRepayment)}</TableCell>
                    <TableCell className="italic text-xs">{formatCurrency(loan.dailyRepayment)}</TableCell>
                    <TableCell className="font-bold text-rose-600">{formatCurrency(loan.remainingBalance)}</TableCell>
                    <TableCell>{getStatusBadge(loan.status)}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-48 text-center text-muted-foreground">
                   No loans found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Loans;

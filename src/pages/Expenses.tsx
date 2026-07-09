import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  TrendingDown, 
  Calendar,
  DollarSign,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { formatCurrency } from '@/lib/calculations';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const Expenses = () => {
  const { expenses, addExpense } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'Store' | 'Daily' | 'Other'>('Daily');
  const [method, setMethod] = useState<'Cash' | 'M-Pesa'>('Cash');

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    addExpense(name, category, parseFloat(amount), method);
    toast.success('Expense recorded successfully');
    setIsModalOpen(false);
    setName('');
    setAmount('');
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const cashExpenses = expenses.filter(e => e.method === 'Cash').reduce((sum, e) => sum + e.amount, 0);
  const mPesaExpenses = expenses.filter(e => e.method === 'M-Pesa').reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">Track your business operational costs.</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700">
              <Plus size={18} />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Record Expense</DialogTitle>
              <DialogDescription>
                Enter the details of the business expense.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddExpense}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="ename">Expense Name</Label>
                  <Input 
                    id="ename" 
                    placeholder="e.g. Office Supplies" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="grid gap-2">
                      <Label htmlFor="ecategory">Category</Label>
                      <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                         <SelectTrigger id="ecategory">
                            <SelectValue placeholder="Category" />
                         </SelectTrigger>
                         <SelectContent>
                            <SelectItem value="Store">Store</SelectItem>
                            <SelectItem value="Daily">Daily</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>
                   <div className="grid gap-2">
                      <Label htmlFor="emethod">Method</Label>
                      <Select value={method} onValueChange={(val: any) => setMethod(val)}>
                         <SelectTrigger id="emethod">
                            <SelectValue placeholder="Method" />
                         </SelectTrigger>
                         <SelectContent>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="eamount">Amount (TSh)</Label>
                  <Input 
                    id="eamount" 
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700">Record Expense</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
         <Card className="shadow-sm border-none bg-rose-50 text-rose-900">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            </CardContent>
         </Card>
         <Card className="shadow-sm border-none bg-orange-50 text-orange-900">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Cash Expenses</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{formatCurrency(cashExpenses)}</div>
            </CardContent>
         </Card>
         <Card className="shadow-sm border-none bg-blue-50 text-blue-900">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">M-Pesa Expenses</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{formatCurrency(mPesaExpenses)}</div>
            </CardContent>
         </Card>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Date</TableHead>
              <TableHead>Expense</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length > 0 ? (
              [...expenses].reverse().map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="text-muted-foreground">
                     {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{expense.name}</TableCell>
                  <TableCell>
                     <Badge variant="outline" className="text-[10px]">{expense.category}</Badge>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-1.5 text-sm">
                        <div className={`w-2 h-2 rounded-full ${expense.method === 'Cash' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                        {expense.method}
                     </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-rose-600">
                     - {formatCurrency(expense.amount)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                   No expenses recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Expenses;

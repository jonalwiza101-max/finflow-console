import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  UserPlus, 
  Phone, 
  Wallet, 
  MoreVertical,
  ChevronRight,
  User
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
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/AppContext';
import { formatCurrency, calculateLoanDetails } from '@/lib/calculations';
import { toast } from 'sonner';

const Customers = () => {
  const { customers, loans, addCustomer } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loanAmount, setLoanAmount] = useState('');

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !loanAmount) {
      toast.error('Please fill in all fields');
      return;
    }

    addCustomer(name, phone, parseFloat(loanAmount));
    toast.success('Customer added successfully');
    setIsAddModalOpen(false);
    setName('');
    setPhone('');
    setLoanAmount('');
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const getCustomerLoan = (customerId: string) => {
    return loans.find(l => l.customerId === customerId && l.status === 'Active');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your clients and their active loans.</p>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus size={18} />
              Add New Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Register New Customer</DialogTitle>
              <DialogDescription>
                Enter customer details and initial loan amount.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCustomer}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Juma Kassim" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="e.g. 0712 345 678" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Loan Amount (TSh)</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="e.g. 100000" 
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />
                  {loanAmount && (
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded border border-dashed mt-1 space-y-1">
                      <div className="flex justify-between">
                        <span>Interest (20%):</span>
                        <span>{formatCurrency(parseFloat(loanAmount) * 0.2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Fee (10%):</span>
                        <span>{formatCurrency(parseFloat(loanAmount) * 0.1)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-1 mt-1">
                        <span>Total Repayment:</span>
                        <span>{formatCurrency(parseFloat(loanAmount) * 1.2)}</span>
                      </div>
                      <div className="flex justify-between italic">
                        <span>Daily Rate (30 days):</span>
                        <span>{formatCurrency((parseFloat(loanAmount) * 1.2) / 30)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Create Profile & Loan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search name or phone..." 
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
              <TableHead className="w-[250px]">Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Active Loan</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => {
                const loan = getCustomerLoan(customer.id);
                return (
                  <TableRow 
                    key={customer.id} 
                    className="cursor-pointer hover:bg-muted/20"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <TableCell className="font-medium">
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                             {customer.name.charAt(0)}
                          </div>
                          {customer.name}
                       </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                    <TableCell>
                      {loan ? (
                        <div className="space-y-1">
                          <div className="text-sm font-semibold">{formatCurrency(loan.amountBorrowed)}</div>
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider">Active</Badge>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No active loan</span>
                      )}
                    </TableCell>
                    <TableCell>
                       {loan ? (
                         <span className="font-bold text-rose-600">{formatCurrency(loan.remainingBalance)}</span>
                       ) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon">
                          <ChevronRight size={18} />
                       </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                   {searchTerm ? 'No customers found matching your search.' : 'No customers registered yet.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Customers;

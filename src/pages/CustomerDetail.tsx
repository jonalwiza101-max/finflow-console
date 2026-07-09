import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Wallet, 
  Receipt, 
  Send, 
  History,
  Phone,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/context/AppContext';
import { formatCurrency } from '@/lib/calculations';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, loans, recordPayment, getRepaymentHistory } = useAppContext();
  
  const customer = customers.find(c => c.id === id);
  const loan = loans.find(l => l.customerId === id && l.status === 'Active');
  const history = getRepaymentHistory(id || '');

  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'M-Pesa'>('Cash');
  const [message, setMessage] = useState('');

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-bold">Customer not found</h2>
        <Button variant="link" onClick={() => navigate('/customers')}>Back to Customers</Button>
      </div>
    );
  }

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loan) {
      toast.error('No active loan found for this customer');
      return;
    }
    if (!paymentAmount) {
      toast.error('Please enter payment amount');
      return;
    }

    recordPayment(customer.id, loan.id, parseFloat(paymentAmount), paymentMethod);
    toast.success('Payment recorded successfully');
    setPaymentAmount('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    toast.success('Message sent to ' + customer.name);
    setMessage('');
  };

  const sendPaymentReminder = () => {
    if (!loan) return;
    const msg = `Dear ${customer.name}, a reminder for your daily repayment of ${formatCurrency(loan.dailyRepayment)}. Remaining balance: ${formatCurrency(loan.remainingBalance)}. Thank you!`;
    setMessage(msg);
    toast.info('Drafted reminder message');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone size={14} />
            {customer.phone}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Loan Stats */}
        <Card className="md:col-span-2 shadow-sm border-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="text-primary" size={20} />
              Active Loan Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loan ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Borrowed</span>
                    <div className="font-bold">{formatCurrency(loan.amountBorrowed)}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Interest (20%)</span>
                    <div className="font-bold">{formatCurrency(loan.interestAmount)}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Repayable</span>
                    <div className="font-bold">{formatCurrency(loan.totalRepayment)}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold text-rose-500">Remaining</span>
                    <div className="font-bold text-rose-600">{formatCurrency(loan.remainingBalance)}</div>
                  </div>
                </div>

                <div className="p-4 bg-muted/40 rounded-xl border border-dashed flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                       <Calendar size={18} />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Daily Repayment Amount</div>
                      <div className="text-lg font-bold">{formatCurrency(loan.dailyRepayment)}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={sendPaymentReminder}>
                    Draft Reminder
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground italic bg-muted/20 rounded-lg border-2 border-dashed">
                No active loan found.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Record Payment */}
        <Card className="shadow-md border-emerald-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="text-emerald-600" size={20} />
              Record Payment
            </CardTitle>
            <CardDescription>Enter payment received from customer</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount Paid (TSh)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-muted-foreground" size={16} />
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className="pl-9"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select value={paymentMethod} onValueChange={(val: any) => setPaymentMethod(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash (TSh)</SelectItem>
                    <SelectItem value="M-Pesa">M-Pesa (TSh)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={!loan}>
                Submit Payment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Payment History */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History size={20} className="text-primary" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.length > 0 ? (
                history.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full">
                          <DollarSign size={14} />
                       </div>
                       <div>
                          <div className="text-sm font-semibold">{formatCurrency(payment.amount)}</div>
                          <div className="text-xs text-muted-foreground">{payment.method} • {new Date(payment.date).toLocaleDateString()}</div>
                       </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">Verified</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm italic">
                  No payments recorded yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Messaging */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Send size={20} className="text-blue-500" />
              Communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quick Message</label>
                <textarea 
                  className="w-full min-h-[120px] p-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Type a message to send to the customer..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                <Send size={16} />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDetail;

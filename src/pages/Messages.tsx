import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  User, 
  Clock,
  CheckCheck
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
import { useAppContext } from '@/context/AppContext';
import { toast } from 'sonner';

const Messages = () => {
  const { customers } = useAppContext();
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [sentMessages, setSentMessages] = useState([
    {
      id: '1',
      customerName: 'Juma Kassim',
      text: 'Dear Juma, your daily repayment of TSh 4,333 is due today. Please make payment via M-Pesa or Cash.',
      date: new Date(Date.now() - 3600000).toISOString(),
      status: 'Sent'
    },
    {
      id: '2',
      customerName: 'Mary Atieno',
      text: 'Congratulations Mary, your loan application has been approved. Please visit our office to collect the cash.',
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'Read'
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !message) {
      toast.error('Please select a customer and type a message');
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomer);
    const newMessage = {
      id: crypto.randomUUID(),
      customerName: customer?.name || 'Unknown',
      text: message,
      date: new Date().toISOString(),
      status: 'Sent'
    };

    setSentMessages([newMessage, ...sentMessages]);
    toast.success('Message sent to ' + customer?.name);
    setMessage('');
    setSelectedCustomer('');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messaging System</h1>
        <p className="text-muted-foreground">Send payment reminders and custom notifications to customers.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* New Message Form */}
        <Card className="md:col-span-1 shadow-md h-fit sticky top-24">
          <CardHeader>
            <CardTitle className="text-lg">Compose Message</CardTitle>
            <CardDescription>Send a direct message to a customer.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Customer</label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Search customer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.length > 0 ? (
                      customers.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground italic text-center">No customers found</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message Body</label>
                <textarea 
                  className="w-full min-h-[150px] p-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your message here..."
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

        {/* Message History */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
               <CardTitle className="text-lg">Message History</CardTitle>
               <CardDescription>Recently sent communications.</CardDescription>
            </div>
            <div className="relative w-48">
               <Search className="absolute left-2.5 top-2.5 text-muted-foreground" size={14} />
               <Input 
                  placeholder="Filter messages..." 
                  className="pl-8 h-9 text-xs" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sentMessages
                .filter(m => m.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || m.text.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((msg) => (
                <div key={msg.id} className="p-4 border rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {msg.customerName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{msg.customerName}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(msg.date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${msg.status === 'Read' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                      {msg.status === 'Read' && <CheckCheck size={10} />}
                      {msg.status}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              ))}

              {sentMessages.length === 0 && (
                 <div className="py-20 text-center text-muted-foreground italic">
                    No messages sent yet.
                 </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;

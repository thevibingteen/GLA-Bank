import { ReactNode, useState } from 'react';
import { useBank } from '@/contexts/BankContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, ArrowDownRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

interface TransferDialogProps {
  type: 'send' | 'receive';
  accountId?: string;
  trigger?: ReactNode;
}

export default function TransferDialog({ type, accountId, trigger }: TransferDialogProps) {
  const { accounts, sendMoney } = useBank();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [fromAccount, setFromAccount] = useState(accountId || '');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    if (!fromAccount || !toAccount) {
      setError('Please select both accounts');
      setLoading(false);
      return;
    }

    if (fromAccount === toAccount) {
      setError('Cannot transfer to the same account');
      setLoading(false);
      return;
    }

    const fromAcc = accounts.find(a => (a.id || a._id) === fromAccount);
    if (fromAcc && fromAcc.balance < amountNum) {
      setError('Insufficient funds');
      setLoading(false);
      return;
    }

    try {
      await sendMoney(fromAccount, toAccount, amountNum, description || 'Transfer');
      
      toast({
        title: "Transfer Initiated",
        description: `$${amountNum.toFixed(2)} transfer request submitted successfully`,
      });
      
      setOpen(false);
      setAmount('');
      setDescription('');
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to initiate transfer');
      toast({
        title: "Transfer Failed",
        description: err.message || 'Failed to initiate transfer',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="flex-1">
            {type === 'send' ? (
              <>
                <ArrowRightLeft className="h-4 w-4 mr-1" />
                Send
              </>
            ) : (
              <>
                <ArrowDownRight className="h-4 w-4 mr-1" />
                Receive
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
        <DialogHeader>
          <DialogTitle>{type === 'send' ? 'Send Money' : 'Receive Money'}</DialogTitle>
          <DialogDescription>
            {type === 'send' ? 'Transfer money to another account' : 'Request money from another account'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="from-account">From Account</Label>
              <Select value={fromAccount} onValueChange={setFromAccount}>
                <SelectTrigger id="from-account">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} - {formatCurrency(account.balance)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-account">To Account</Label>
              <Select value={toAccount} onValueChange={setToAccount}>
                <SelectTrigger id="to-account">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} ({account.accountNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="What's this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-green-700 to-emerald-600"
              disabled={loading}
            >
              {loading ? 'Processing...' : type === 'send' ? 'Send Money' : 'Request Money'}
            </Button>
          </DialogFooter>
        </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

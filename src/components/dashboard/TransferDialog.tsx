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

interface TransferDialogProps {
  type: 'send' | 'receive';
  accountId?: string;
  trigger?: ReactNode;
}

export default function TransferDialog({ type, accountId, trigger }: TransferDialogProps) {
  const { accounts, sendMoney } = useBank();
  const [open, setOpen] = useState(false);
  const [fromAccount, setFromAccount] = useState(accountId || '');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!fromAccount || !toAccount) {
      setError('Please select both accounts');
      return;
    }

    if (fromAccount === toAccount) {
      setError('Cannot transfer to the same account');
      return;
    }

    const fromAcc = accounts.find(a => a.id === fromAccount);
    if (fromAcc && fromAcc.balance < amountNum) {
      setError('Insufficient funds');
      return;
    }

    sendMoney(fromAccount, toAccount, amountNum, description || 'Transfer');
    setOpen(false);
    setAmount('');
    setDescription('');
    setError('');
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
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600">
              {type === 'send' ? 'Send Money' : 'Request Money'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

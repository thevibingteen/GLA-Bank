import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Filter, Inbox, Search } from 'lucide-react';
import { useBank } from '@/contexts/BankContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'debit' | 'credit';
  status?: 'pending' | 'approved' | 'rejected';
}

const staticTransactions: Transaction[] = [
  { id: 's1', date: '2024-01-15', description: 'Grocery Store', amount: -125.50, category: 'Food', type: 'debit' },
  { id: 's2', date: '2024-01-14', description: 'Salary Deposit', amount: 3500.00, category: 'Income', type: 'credit' },
  { id: 's3', date: '2024-01-13', description: 'Electric Bill', amount: -89.99, category: 'Utilities', type: 'debit' },
  { id: 's4', date: '2024-01-12', description: 'Online Shopping', amount: -249.99, category: 'Shopping', type: 'debit' },
  { id: 's5', date: '2024-01-11', description: 'Restaurant', amount: -67.50, category: 'Food', type: 'debit' },
  { id: 's6', date: '2024-01-10', description: 'Gas Station', amount: -45.00, category: 'Transport', type: 'debit' },
  { id: 's7', date: '2024-01-09', description: 'Freelance Payment', amount: 850.00, category: 'Income', type: 'credit' },
  { id: 's8', date: '2024-01-08', description: 'Gym Membership', amount: -49.99, category: 'Health', type: 'debit' },
];

export default function TransactionList() {
  const { transactions: bankTransactions } = useBank();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeType, setActiveType] = useState<'all' | 'credit' | 'debit'>('all');

  const derivedTransactions = useMemo<Transaction[]>(() => {
    if (bankTransactions.length === 0) {
      return staticTransactions;
    }

    return [
      ...bankTransactions.map((txn) => ({
        id: txn.id,
        date: txn.date,
        description: txn.description || (txn.type === 'receive' ? 'Incoming transfer' : 'Transfer'),
        amount: txn.type === 'receive' ? txn.amount : -txn.amount,
        category: 'Transfer',
        type: (txn.type === 'receive' ? 'credit' : 'debit') as 'credit' | 'debit',
        status: txn.status,
      })),
      ...staticTransactions.slice(0, 4),
    ];
  }, [bankTransactions]);

  const summary = useMemo(() => {
    const totals = derivedTransactions.reduce(
      (acc, txn) => {
        if (txn.type === 'credit') acc.credit += txn.amount;
        if (txn.type === 'debit') acc.debit += Math.abs(txn.amount);
        return acc;
      },
      { credit: 0, debit: 0 }
    );
    return {
      credit: totals.credit,
      debit: totals.debit,
      net: totals.credit - totals.debit,
    };
  }, [derivedTransactions]);

  const filteredTransactions = derivedTransactions
    .filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(t => activeType === 'all' ? true : t.type === activeType)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Income': 'bg-green-100 text-green-800',
      'Food': 'bg-orange-100 text-orange-800',
      'Utilities': 'bg-green-100 text-green-800',
      'Shopping': 'bg-purple-100 text-purple-800',
      'Transport': 'bg-yellow-100 text-yellow-800',
      'Health': 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const inrFmt = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });

  const filterOptions = [
    { label: 'All activity', value: 'all', amount: summary.net },
    { label: 'Incoming', value: 'credit', amount: summary.credit },
    { label: 'Spending', value: 'debit', amount: summary.debit },
  ] as const;

  return (
    <Card className="app-background bg-transparent">
      <CardHeader>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Search, filter and monitor the latest account activity
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search description or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveType(option.value)}
                className={`rounded-xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                  activeType === option.value
                    ? 'border-primary/40 bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/20'
                }`}
              >
                <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                  <Filter className="h-3 w-3" />
                  {option.label}
                </p>
                <p className="text-lg font-semibold mt-1">
                  {option.value === 'debit' ? '-' : option.value === 'credit' ? '+' : ''}
                  {inrFmt.format(Math.abs(option.amount))}
                </p>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredTransactions.length}</span> result
              {filteredTransactions.length !== 1 && 's'}
              {activeType !== 'all' && (
                <> filtered by <span className="font-medium text-foreground">{activeType}</span></>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge className="bg-green-100 text-green-700">Credit</Badge>
              <Badge className="bg-red-100 text-red-700">Debit</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">No transactions found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter selections.
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                {filteredTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b transition-colors hover:bg-muted/40"
                  >
                      <TableCell className="font-medium">
                        {new Date(transaction.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{transaction.description}</span>
                          <span className="text-xs text-muted-foreground">
                            {transaction.type === 'credit' ? 'Incoming transfer' : 'Card purchase'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getCategoryColor(transaction.category)}>
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === 'approved'
                              ? 'default'
                              : transaction.status === 'rejected'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className="capitalize"
                        >
                          {transaction.status ?? (transaction.type === 'credit' ? 'settled' : 'posted')}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : '-'}
                        {inrFmt.format(Math.abs(transaction.amount))}
                      </TableCell>
                    </motion.tr>
                ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

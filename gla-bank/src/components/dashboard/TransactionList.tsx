import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowUpDown } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'debit' | 'credit';
}

const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-01-15', description: 'Grocery Store', amount: -125.50, category: 'Food', type: 'debit' },
  { id: '2', date: '2024-01-14', description: 'Salary Deposit', amount: 3500.00, category: 'Income', type: 'credit' },
  { id: '3', date: '2024-01-13', description: 'Electric Bill', amount: -89.99, category: 'Utilities', type: 'debit' },
  { id: '4', date: '2024-01-12', description: 'Online Shopping', amount: -249.99, category: 'Shopping', type: 'debit' },
  { id: '5', date: '2024-01-11', description: 'Restaurant', amount: -67.50, category: 'Food', type: 'debit' },
  { id: '6', date: '2024-01-10', description: 'Gas Station', amount: -45.00, category: 'Transport', type: 'debit' },
  { id: '7', date: '2024-01-09', description: 'Freelance Payment', amount: 850.00, category: 'Income', type: 'credit' },
  { id: '8', date: '2024-01-08', description: 'Gym Membership', amount: -49.99, category: 'Health', type: 'debit' },
];

export default function TransactionList() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredTransactions = transactions
    .filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Income': 'bg-green-100 text-green-800',
      'Food': 'bg-orange-100 text-orange-800',
      'Utilities': 'bg-blue-100 text-blue-800',
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

  return (
    <Card className="app-background bg-transparent">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Recent Transactions</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {new Date(transaction.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getCategoryColor(transaction.category)}>
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{inrFmt.format(Math.abs(transaction.amount))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

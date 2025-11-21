import { useBank } from '@/contexts/BankContext';
import Sidebar from '@/components/dashboard/Sidebar';
import PageHeader from '@/components/dashboard/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Users, CreditCard, ArrowRightLeft, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminPage() {
  const { getAllAccounts, getAllTransactions, approveTransaction, rejectTransaction } = useBank();
  const accounts = getAllAccounts();
  const transactions = getAllTransactions();

  const pendingTransactions = transactions.filter((t) => t.status === 'pending');
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="flex min-h-screen bg-muted/20 dark:bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <PageHeader
          title="Admin Console"
          description="Monitor accounts, approve transfers, and keep your institution healthy."
          tag="Admin"
          actions={
            <>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export audit log
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-green-700 to-emerald-700 text-white">
                <ShieldCheck className="h-4 w-4" />
                Security view
              </Button>
            </>
          }
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total accounts</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{accounts.length}</p>
                  <p className="text-xs text-muted-foreground">Active accounts</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total balance</CardTitle>
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
                  <p className="text-xs text-muted-foreground">Across all accounts</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total transactions</CardTitle>
                  <ArrowRightLeft className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{transactions.length}</p>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending approvals</CardTitle>
                  <ShieldCheck className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{pendingTransactions.length}</p>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Pending transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingTransactions.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <ArrowRightLeft className="mx-auto mb-3 h-10 w-10 opacity-40" />
                    <p>Everything is up to date.</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>From</TableHead>
                          <TableHead>To</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingTransactions.map((transaction) => {
                          const fromAcc = accounts.find((a) => a.id === transaction.fromAccount);
                          const toAcc = accounts.find((a) => a.id === transaction.toAccount);
                          return (
                            <TableRow key={transaction.id}>
                              <TableCell className="font-medium">
                                {new Date(transaction.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </TableCell>
                              <TableCell>{fromAcc?.name || 'Unknown'}</TableCell>
                              <TableCell>{toAcc?.name || 'Unknown'}</TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell className="text-right font-semibold">{formatCurrency(transaction.amount)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1 text-green-600 hover:bg-green-50 dark:hover:bg-emerald-500/10"
                                    onClick={async () => {
                                      try {
                                        await approveTransaction(transaction.id || transaction._id || '');
                                      } catch (err: any) {
                                        console.error('Failed to approve transaction:', err);
                                      }
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                                    onClick={async () => {
                                      try {
                                        await rejectTransaction(transaction.id || transaction._id || '');
                                      } catch (err: any) {
                                        console.error('Failed to reject transaction:', err);
                                      }
                                    }}
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account name</TableHead>
                        <TableHead>Account number</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-medium">{account.name}</TableCell>
                          <TableCell>{account.accountNumber}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {account.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>{account.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(account.balance)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction history</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <ArrowRightLeft className="mx-auto mb-3 h-10 w-10 opacity-40" />
                    <p>No transactions yet</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>From</TableHead>
                          <TableHead>To</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => {
                          const fromAcc = accounts.find((a) => a.id === transaction.fromAccount);
                          const toAcc = accounts.find((a) => a.id === transaction.toAccount);
                          return (
                            <TableRow key={transaction.id}>
                              <TableCell className="font-medium">
                                {new Date(transaction.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </TableCell>
                              <TableCell>{fromAcc?.name || 'Unknown'}</TableCell>
                              <TableCell>{toAcc?.name || 'Unknown'}</TableCell>
                              <TableCell>{transaction.description}</TableCell>
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
                                  {transaction.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-semibold">{formatCurrency(transaction.amount)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

import { useBank } from '@/contexts/BankContext';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bell, Users, CreditCard, ArrowRightLeft, CheckCircle, XCircle } from 'lucide-react';

export default function AdminPage() {
  const { getAllAccounts, getAllTransactions, approveTransaction, rejectTransaction } = useBank();
  const accounts = getAllAccounts();
  const transactions = getAllTransactions();

  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sidebar />
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage accounts and approve transactions</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {pendingTransactions.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Accounts
                  </CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{accounts.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active accounts</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Balance
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-muted-foreground mt-1">Across all accounts</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Transactions
                  </CardTitle>
                  <ArrowRightLeft className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{transactions.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pending Approval
                  </CardTitle>
                  <Bell className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingTransactions.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
                </CardContent>
              </Card>
            </div>

            {/* Pending Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingTransactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ArrowRightLeft className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No pending transactions</p>
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
                          const fromAcc = accounts.find(a => a.id === transaction.fromAccount);
                          const toAcc = accounts.find(a => a.id === transaction.toAccount);
                          return (
                            <TableRow key={transaction.id}>
                              <TableCell className="font-medium">
                                {new Date(transaction.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </TableCell>
                              <TableCell>{fromAcc?.name || 'Unknown'}</TableCell>
                              <TableCell>{toAcc?.name || 'Unknown'}</TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell className="text-right font-semibold">
                                ${transaction.amount.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 hover:bg-green-50"
                                    onClick={() => approveTransaction(transaction.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:bg-red-50"
                                    onClick={() => rejectTransaction(transaction.id)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
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

            {/* All Accounts */}
            <Card>
              <CardHeader>
                <CardTitle>All Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account Name</TableHead>
                        <TableHead>Account Number</TableHead>
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
                            <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                              {account.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* All Transactions History */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ArrowRightLeft className="h-12 w-12 mx-auto mb-2 opacity-50" />
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
                          const fromAcc = accounts.find(a => a.id === transaction.fromAccount);
                          const toAcc = accounts.find(a => a.id === transaction.toAccount);
                          return (
                            <TableRow key={transaction.id}>
                              <TableCell className="font-medium">
                                {new Date(transaction.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </TableCell>
                              <TableCell>{fromAcc?.name || 'Unknown'}</TableCell>
                              <TableCell>{toAcc?.name || 'Unknown'}</TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    transaction.status === 'approved' ? 'default' : 
                                    transaction.status === 'rejected' ? 'destructive' : 
                                    'secondary'
                                  }
                                  className="capitalize"
                                >
                                  {transaction.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                ${transaction.amount.toFixed(2)}
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
          </div>
        </main>
      </div>
    </div>
  );
}

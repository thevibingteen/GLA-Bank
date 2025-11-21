import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBank } from '@/contexts/BankContext';
import Sidebar from '@/components/dashboard/Sidebar';
import AccountCard from '@/components/dashboard/AccountCard';
import TransactionList from '@/components/dashboard/TransactionList';
import TransferDialog from '@/components/dashboard/TransferDialog';
import { Bell, CreditCard, ShieldCheck, Wallet, Clock, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';
import Logo from '@/components/ui/Logo';
import { motion } from 'framer-motion';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

export default function DashboardPage() {
  const { user } = useAuth();
  const { accounts, transactions } = useBank();
  const navigate = useNavigate();

  const totalBalance = useMemo(
    () => accounts.reduce((sum, account) => sum + account.balance, 0),
    [accounts]
  );

  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const approvedTransfers = transactions.filter(t => t.status === 'approved');

  return (
    <div className="flex h-screen bg-background dark:bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card dark:bg-card border-b px-6 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Logo size="sm" showText={false} />
              <div>
                <p className="text-sm text-muted-foreground">Good day, {user?.name}</p>
                <h1 className="text-2xl font-bold">Your personal banking hub</h1>
                <p className="text-sm text-muted-foreground">Track balances, transfers, and alerts in one place.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <motion.div 
            className="max-w-7xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
              <Card className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white border-none shadow-xl">
                <CardHeader className="flex flex-col gap-1">
                  <CardDescription className="text-white/70">Total Available Balance</CardDescription>
                  <CardTitle className="text-4xl font-bold">
                    <AnimatedNumber value={totalBalance} prefix="$" decimals={2} />
                  </CardTitle>
                  <p className="text-sm text-white/80">
                    Across {accounts.length} account{accounts.length === 1 ? '' : 's'} · {pendingTransactions.length} transfer
                    {pendingTransactions.length === 1 ? '' : 's'} pending
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wide text-white/70">Quick forecast</p>
                    <p className="text-lg font-medium">You are on track to reach your savings goal this month.</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <TransferDialog
                      type="send"
                      trigger={
                        <Button className="bg-white text-green-700 hover:bg-white/90 gap-2">
                          <ArrowRightLeft className="h-4 w-4" />
                          Quick transfer
                        </Button>
                      }
                    />
                    <TransferDialog
                      type="receive"
                      trigger={
                        <Button variant="outline" className="text-white border-white/40 hover:bg-white/10 gap-2">
                          <Wallet className="h-4 w-4" />
                          Request funds
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Security center
                  </CardTitle>
                  <CardDescription>Stay protected with real-time alerts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary">2FA</Badge>
                    <div>
                      <p className="font-medium text-sm">Two-factor authentication enabled</p>
                      <p className="text-xs text-muted-foreground">Change devices or recovery options anytime.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline">Alerts</Badge>
                    <div>
                      <p className="font-medium text-sm">3 unread security alerts</p>
                      <p className="text-xs text-muted-foreground">Last unusual sign-in 2 days ago from Canada.</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Review security tips
                  </Button>
                </CardContent>
              </Card>
              </motion.div>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active accounts</CardTitle>
                  <CreditCard className="h-4 w-4 text-green-700" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{accounts.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Checking, savings, and credit</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Approved transfers</CardTitle>
                  <Wallet className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{approvedTransfers.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">All-time completed transfers</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending approvals</CardTitle>
                  <Clock className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingTransactions.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting admin review</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Cash accounts</CardTitle>
                  <CardDescription>Balances across your primary accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {accounts.slice(0, 3).map((account) => (
                    <div key={account.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{account.name}</p>
                        <p className="text-xs text-muted-foreground">{account.accountNumber}</p>
                      </div>
                      <p className="font-semibold">{formatCurrency(account.balance)}</p>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full" onClick={() => navigate('/accounts')}>
                    View all accounts
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              {accounts.map((account) => (
                <AccountCard 
                  key={account.id}
                  title={account.name} 
                  balance={account.balance} 
                  change={2.5} 
                  type={account.type} 
                />
              ))}
            </motion.div>

            <TransactionList />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
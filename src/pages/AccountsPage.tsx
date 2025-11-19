import { useBank } from '@/contexts/BankContext';
import Sidebar from '@/components/dashboard/Sidebar';
import PageHeader from '@/components/dashboard/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, PiggyBank, Wallet, ArrowDownRight, PlusCircle } from 'lucide-react';
import TransferDialog from '@/components/dashboard/TransferDialog';
import { formatCurrency } from '@/lib/utils';

export default function AccountsPage() {
  const { accounts } = useBank();

  const getTypeColor = (type: string) => {
    const colors = {
      checking: 'from-blue-500 to-blue-600',
      savings: 'from-green-500 to-green-600',
      credit: 'from-purple-500 to-purple-600',
    };
    return colors[type as keyof typeof colors] ?? 'from-slate-500 to-slate-600';
  };

  const totalAssets = accounts.filter((a) => a.balance > 0).reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = accounts.filter((a) => a.balance < 0).reduce((sum, a) => sum + Math.abs(a.balance), 0);
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="flex min-h-screen bg-muted/20 dark:bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <PageHeader
          title="My Accounts"
          description="Track balances, move money, and manage all of your accounts."
          tag="Accounts"
          actions={
            <>
              <TransferDialog
                type="send"
                trigger={
                  <Button variant="outline" className="gap-2">
                    <ArrowRightLeft className="h-4 w-4" />
                    Quick transfer
                  </Button>
                }
              />
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-emerald-500">
                <PlusCircle className="h-4 w-4" />
                Add account
              </Button>
            </>
          }
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total assets</CardTitle>
                  <PiggyBank className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalAssets)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Across all positive balances</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total liabilities</CardTitle>
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalLiabilities)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Lines of credit and cards</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Net worth</CardTitle>
                  <Wallet className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(netWorth)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Updated in real time</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>Account health snapshot</CardTitle>
                <CardDescription>Monitor utilization, account mix, and risk exposure.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {accounts.slice(0, 4).map((account) => (
                  <div key={account.id} className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">{account.type}</p>
                    <p className="text-lg font-semibold">{account.name}</p>
                    <p className="text-xs text-muted-foreground">{account.accountNumber}</p>
                    <p className="mt-3 text-sm font-medium">{formatCurrency(account.balance)}</p>
                    <div className="mt-2 h-1.5 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500" style={{ width: '70%' }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {accounts.map((account) => (
                <Card key={account.id} className="overflow-hidden border-border/70 bg-background/80 shadow-sm transition hover:shadow-md">
                  <div className={`h-2 bg-gradient-to-r ${getTypeColor(account.type)}`} />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{account.name}</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">{account.accountNumber}</p>
                      </div>
                      <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>{account.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current balance</p>
                      <p className="mt-1 text-3xl font-bold">{formatCurrency(account.balance)}</p>
                    </div>
                    <div className="flex gap-2">
                      <TransferDialog type="send" accountId={account.id} />
                      <TransferDialog type="receive" accountId={account.id} />
                      <Button variant="outline" size="sm">
                        View details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
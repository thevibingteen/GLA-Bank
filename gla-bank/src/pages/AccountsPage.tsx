import { useBank } from '@/contexts/BankContext';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus } from 'lucide-react';
import TransferDialog from '@/components/dashboard/TransferDialog';

export default function AccountsPage() {
  const { accounts } = useBank();

  const getTypeColor = (type: string) => {
    const colors = {
      checking: 'from-blue-500 to-blue-600',
      savings: 'from-green-500 to-green-600',
      credit: 'from-purple-500 to-purple-600'
    };
    return colors[type as keyof typeof colors];
  };

  const totalAssets = accounts
    .filter(a => a.balance > 0)
    .reduce((sum, a) => sum + a.balance, 0);
  
  const totalLiabilities = accounts
    .filter(a => a.balance < 0)
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sidebar />
              <div>
                <h1 className="text-2xl font-bold">My Accounts</h1>
                <p className="text-sm text-muted-foreground">Manage all your banking accounts</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-green-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {accounts.map((account) => (
                <Card key={account.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className={`h-2 bg-gradient-to-r ${getTypeColor(account.type)}`} />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{account.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{account.accountNumber}</p>
                      </div>
                      <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                        {account.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Balance</p>
                      <p className="text-3xl font-bold mt-1">
                        ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <TransferDialog type="send" accountId={account.id} />
                      <TransferDialog type="receive" accountId={account.id} />
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Assets</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Liabilities</p>
                    <p className="text-2xl font-bold text-red-600">
                      ${totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Net Worth</p>
                    <p className="text-2xl font-bold">
                      ${(totalAssets - totalLiabilities).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
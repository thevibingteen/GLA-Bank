import { useAuth } from '@/contexts/AuthContext';
import { useBank } from '@/contexts/BankContext';
import Sidebar from '@/components/dashboard/Sidebar';
import AccountCard from '@/components/dashboard/AccountCard';
import TransactionList from '@/components/dashboard/TransactionList';
import QuickActions from '@/components/dashboard/QuickActions';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useAuth();
  const { accounts } = useBank();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sidebar />
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
                <p className="text-sm text-muted-foreground">Here's your financial overview</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Account Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <AccountCard 
                  key={account.id}
                  title={account.name} 
                  balance={account.balance} 
                  change={2.5} 
                  type={account.type} 
                />
              ))}
            </div>

            {/* Quick Actions */}
            <QuickActions />

            {/* Transactions */}
            <TransactionList />
          </div>
        </main>
      </div>
    </div>
  );
}
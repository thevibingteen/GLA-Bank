import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface AccountCardProps {
  title: string;
  balance: number;
  change: number;
  type: 'checking' | 'savings' | 'credit';
}

export default function AccountCard({ 
  title = 'Checking Account', 
  balance = 5420.50, 
  change = 2.5, 
  type = 'checking' 
}: AccountCardProps) {
  const isPositive = change >= 0;
  
  const gradients = {
    checking: 'from-blue-500 to-blue-600',
    savings: 'from-green-500 to-green-600',
    credit: 'from-purple-500 to-purple-600'
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`h-2 bg-gradient-to-r ${gradients[type]}`} />
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-3xl font-bold">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {Math.abs(change)}%
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="h-3 w-3" />
          <span>vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

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
    checking: 'from-green-600 to-green-700',
    savings: 'from-emerald-500 to-emerald-600',
    credit: 'from-green-700 to-emerald-700'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className={`h-2 bg-gradient-to-r ${gradients[type]}`} />
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-3xl font-bold">
                <AnimatedNumber value={balance} prefix="$" decimals={2} />
              </p>
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
    </motion.div>
  );
}

import { Button } from '@/components/ui/button';
import { ArrowRightLeft, FileText, Wallet } from 'lucide-react';

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Button 
        variant="outline" 
        className="h-auto py-6 flex flex-col items-center gap-3 hover:bg-blue-50 hover:border-blue-300 transition-all"
      >
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <ArrowRightLeft className="h-6 w-6 text-blue-600" />
        </div>
        <div className="text-center">
          <p className="font-semibold">Transfer Money</p>
          <p className="text-xs text-muted-foreground">Send to another account</p>
        </div>
      </Button>

      <Button 
        variant="outline" 
        className="h-auto py-6 flex flex-col items-center gap-3 hover:bg-green-50 hover:border-green-300 transition-all"
      >
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <FileText className="h-6 w-6 text-green-600" />
        </div>
        <div className="text-center">
          <p className="font-semibold">Pay Bills</p>
          <p className="text-xs text-muted-foreground">Manage your payments</p>
        </div>
      </Button>

      <Button 
        variant="outline" 
        className="h-auto py-6 flex flex-col items-center gap-3 hover:bg-purple-50 hover:border-purple-300 transition-all"
      >
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
          <Wallet className="h-6 w-6 text-purple-600" />
        </div>
        <div className="text-center">
          <p className="font-semibold">Deposit</p>
          <p className="text-xs text-muted-foreground">Add funds to account</p>
        </div>
      </Button>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, FileText, Wallet, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import TransferDialog from '@/components/dashboard/TransferDialog';
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: ArrowRightLeft,
      title: 'Transfer Money',
      description: 'Send to another account',
      accent: 'bg-blue-100 text-blue-600',
      gradient: 'hover:border-blue-300 hover:bg-blue-50',
      badge: 'Popular',
      dialogType: 'send' as const,
    },
    {
      icon: FileText,
      title: 'Pay Bills',
      description: 'Manage your payments',
      accent: 'bg-green-100 text-green-600',
      gradient: 'hover:border-green-300 hover:bg-green-50',
      badge: 'New',
      onClick: () => navigate('/accounts'),
    },
    {
      icon: Wallet,
      title: 'Deposit Funds',
      description: 'Add money instantly',
      accent: 'bg-purple-100 text-purple-600',
      gradient: 'hover:border-purple-300 hover:bg-purple-50',
      badge: 'Instant',
      dialogType: 'receive' as const,
    },
    {
      icon: ShieldCheck,
      title: 'Secure Vault',
      description: 'Lock savings automatically',
      accent: 'bg-amber-100 text-amber-600',
      gradient: 'hover:border-amber-300 hover:bg-amber-50',
      badge: 'Soon',
      disabled: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map(({ icon: Icon, title, description, accent, gradient, badge, disabled, dialogType, onClick }) => {
        const button = (
          <Button
            variant="outline"
            className={cn(
              'h-auto py-5 px-4 flex flex-col items-start gap-4 text-left transition-all border-dashed',
              gradient,
              disabled && 'opacity-60 cursor-not-allowed'
            )}
            disabled={disabled}
            onClick={onClick}
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={!disabled ? { y: -4, scale: 1.01 } : undefined}
              whileTap={!disabled ? { scale: 0.99 } : undefined}
              className="w-full"
            >
              <div className="flex w-full items-start justify-between">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${accent}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="uppercase text-[10px] tracking-wide">
                  {badge}
                </Badge>
              </div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-tight">{description}</p>
              </div>
            </motion.div>
          </Button>
        );

        if (dialogType && !disabled) {
          return (
            <TransferDialog
              key={title}
              type={dialogType}
              trigger={button}
            />
          );
        }

        return (
          <div key={title}>
            {button}
          </div>
        );
      })}
    </div>
  );
}

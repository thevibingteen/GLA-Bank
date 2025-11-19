import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Home, 
  CreditCard, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Menu,
  User
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Sidebar() {
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: CreditCard, label: 'Accounts', path: '/accounts' },
    { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
    { icon: Shield, label: 'Admin', path: '/admin' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              navigate(item.path);
              setOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-foreground hover:bg-accent/5'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 border-r bg-background">
        <SidebarContent />
      </div>
    </>
  );
}
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
  User,
  Shield,
  Headphones,
  Sparkles,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const primaryItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: CreditCard, label: 'Accounts', path: '/accounts' },
    { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
    { icon: Shield, label: 'Admin', path: '/admin' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const secondaryItems = [
    { icon: Sparkles, label: 'What’s New', description: 'Latest releases', action: () => navigate('/dashboard') },
    { icon: Headphones, label: 'Support', description: '24/7 priority help', action: () => window.open('mailto:support@glabank.com') },
  ];

  const renderSidebarContent = (isCollapsed: boolean, showCollapseToggle = true) => (
    <div className={`flex h-full flex-col bg-background text-foreground ${isCollapsed ? 'items-center' : ''}`}>
      <div className="w-full border-b border-border p-5">
        <div
          className={`rounded-xl bg-gradient-to-r from-blue-600/10 to-emerald-500/10 p-3 ${
            isCollapsed ? 'flex flex-col items-center text-center gap-2' : 'flex items-center gap-3 justify-between'
          }`}
        >
          <div className="rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 p-2">
            <User className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed ? (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name || 'GlaBank user'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          ) : (
            <p className="text-xs font-medium text-muted-foreground">{user?.name || 'GlaBank user'}</p>
          )}
          <div className={isCollapsed ? '' : 'ml-2'}>
            <ThemeToggle />
          </div>
        </div>
        {!isCollapsed && (
          <div className="mt-4 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
            Personalized insights are updated in real-time. Keep your profile secure and up to date.
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {primaryItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <motion.button
              key={item.label}
              layout
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                navigate(item.path);
                setOpen(false);
              }}
              title={item.label}
              className={`group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition ${
                isCollapsed ? 'justify-center' : 'gap-3'
              } ${
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}

        <div className="pt-4">
          {!isCollapsed && (
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Help &amp; updates</p>
          )}
          <div className="space-y-2">
            {secondaryItems.map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  item.action();
                  setOpen(false);
                }}
                title={item.label}
                className={`w-full rounded-lg border border-dashed border-border px-3 py-2 text-sm transition hover:border-primary/40 hover:bg-primary/5 ${
                  isCollapsed ? 'flex items-center justify-center' : 'text-left'
                }`}
              >
                <div className={`flex items-center font-medium ${isCollapsed ? '' : 'gap-2'}`}>
                  <item.icon className="h-4 w-4 text-primary" />
                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                {!isCollapsed && <p className="text-xs text-muted-foreground">{item.description}</p>}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      <div className="border-t border-border p-4 space-y-3 w-full">
        <Button
          variant="ghost"
          className={`w-full gap-3 text-destructive hover:bg-destructive/10 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          onClick={logout}
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </Button>

        {showCollapseToggle && (
          <Button
            variant="outline"
            className="w-full justify-center border-dashed border-border text-xs"
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? (
              <>
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Expand navigation</span>
              </>
            ) : (
              <>
                <ChevronsLeft className="h-4 w-4" />
                Collapse
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            {renderSidebarContent(false, false)}
          </SheetContent>
        </Sheet>
      </div>

      <motion.aside
        className="hidden border-r border-border/80 bg-background/95 backdrop-blur lg:block"
        animate={{ width: collapsed ? 96 : 288 }}
        initial={false}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {renderSidebarContent(collapsed, true)}
      </motion.aside>
    </>
  );
}
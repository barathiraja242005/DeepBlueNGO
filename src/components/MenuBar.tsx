import { useState } from 'react';
import { Home, MapPin, BarChart3, Users, Settings, Menu, X, Navigation, LogOut, Shield, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

interface MenuBarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'map', icon: MapPin, label: 'Disease Map' },
  { id: 'streets', icon: Navigation, label: 'Street Analysis' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'ngo', icon: Users, label: 'NGO Network' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

const MenuBar = ({ activeItem = 'map', onItemClick }: MenuBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, logout, isAdmin, isNGO } = useUser();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="fixed left-0 top-0 h-screen z-50 bg-card border-r border-border shadow-lg"
      style={{ width: isExpanded ? '240px' : '64px' }}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <motion.div
          className="p-4 border-b border-border flex items-center gap-3"
          style={{ height: '73px' }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md flex-shrink-0">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Menu className="h-4 w-4 text-primary-foreground" />
            </motion.div>
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <h2 className="text-sm font-bold text-foreground whitespace-nowrap">Menu</h2>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Menu Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <motion.button
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onItemClick?.(item.id)}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all relative group ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <motion.div
          className="border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* User Info */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${isAdmin ? 'bg-red-500/20' : 'bg-green-500/20'} flex items-center justify-center flex-shrink-0`}>
                {isAdmin ? <Shield className="h-4 w-4 text-red-600" /> : <Building2 className="h-4 w-4 text-green-600" />}
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="overflow-hidden flex-1 min-w-0"
                  >
                    <div className="text-xs font-bold text-foreground truncate">{user?.name}</div>
                    <div className="text-[10px] text-muted-foreground capitalize">{user?.role}</div>
                    {isNGO && <div className="text-[10px] text-primary truncate">{user?.state}</div>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full px-4 py-3 flex items-center gap-3 text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-sm font-medium"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Version */}
          <div className="p-4">
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-[10px] text-muted-foreground text-center"
                >
                  CURA-NGO v1.0
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MenuBar;

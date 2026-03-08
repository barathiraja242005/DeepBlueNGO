import { useState } from 'react';
import { Home, MapPin, BarChart3, Users, Settings, Menu, X, Navigation, LogOut, Shield, Building2, Database, Crown, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

interface MenuBarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
  onUpgradePremium?: () => void;
}

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard', adminOnly: false },
  { id: 'map', icon: MapPin, label: 'Disease Map', adminOnly: false },
  { id: 'streets', icon: Navigation, label: 'Street Analysis', adminOnly: false },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', adminOnly: false },
  { id: 'ngo', icon: Users, label: 'NGO Network', adminOnly: false },
  { id: 'ngo-management', icon: Building2, label: 'NGO Management', adminOnly: true },
  { id: 'user-management', icon: Database, label: 'User Management', adminOnly: true },
  { id: 'settings', icon: Settings, label: 'Settings', adminOnly: false },
];

const MenuBar = ({ activeItem = 'map', onItemClick, onUpgradePremium }: MenuBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, logout, isAdmin, isNGO, isPremium } = useUser();

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
          {menuItems.filter(item => !item.adminOnly || isAdmin).map((item, index) => {
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
              <div className={`w-8 h-8 rounded-lg ${isAdmin ? 'bg-red-500/20' : isPremium ? 'bg-gradient-to-br from-[#0F2854]/20 to-[#4988C4]/20' : 'bg-green-500/20'} flex items-center justify-center flex-shrink-0`}>
                {isAdmin ? <Shield className="h-4 w-4 text-red-600" /> : isPremium ? <Crown className="h-4 w-4 text-[#0F2854]" /> : <Building2 className="h-4 w-4 text-green-600" />}
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="overflow-hidden flex-1 min-w-0"
                  >
                    <div className="text-xs font-bold text-foreground truncate flex items-center gap-1.5">
                      {user?.name}
                      {isPremium && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#0F2854] to-[#1C4D8D] text-[8px] font-bold text-white uppercase tracking-wider">
                          <Crown className="h-2.5 w-2.5" />
                          PRO
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground capitalize">{user?.role}</div>
                    {isNGO && <div className="text-[10px] text-primary truncate">{user?.state}</div>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Upgrade to Premium - Only for free NGO users */}
          {isNGO && !isPremium && (
            <div className="px-3 py-2 border-b border-border">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onUpgradePremium}
                className="w-full flex items-center gap-2 px-2 py-2.5 rounded-xl bg-gradient-to-r from-[#0F2854] to-[#1C4D8D] text-white transition-all hover:shadow-lg hover:shadow-[#0F2854]/20"
              >
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3.5 w-3.5 text-white" />
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="overflow-hidden min-w-0"
                    >
                      <p className="text-[10px] font-bold whitespace-nowrap">Upgrade to Premium</p>
                      <p className="text-[8px] text-white/70 whitespace-nowrap">₹999/mo • All States</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          )}

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
                  CURA v1.0
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

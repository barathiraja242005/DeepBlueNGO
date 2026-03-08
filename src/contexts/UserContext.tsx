import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'ngo';
export type SubscriptionTier = 'free' | 'premium';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  ngoId?: string; // Only for NGO users
  state?: string; // Only for NGO users - their operational state
  city?: string; // Only for NGO users - their operational city
  subscription?: SubscriptionTier; // NGO subscription tier
}

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  upgradeToPremium: () => void;
  isAdmin: boolean;
  isNGO: boolean;
  isPremium: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const upgradeToPremium = () => {
    if (user) {
      const updatedUser = { ...user, subscription: 'premium' as SubscriptionTier };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const isAdmin = user?.role === 'admin';
  const isNGO = user?.role === 'ngo';
  const isPremium = user?.subscription === 'premium';

  return (
    <UserContext.Provider value={{ user, login, logout, upgradeToPremium, isAdmin, isNGO, isPremium }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

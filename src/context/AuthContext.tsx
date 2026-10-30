import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { dataService } from '../services/dataService';
import { INITIAL_USERS } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string) => Promise<{ success: boolean; message: string }>;
  register: (data: {
    name: string;
    email: string;
    role: UserRole;
    department: string;
    rollNumber: string;
  }) => Promise<{ success: boolean; message: string }>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      await dataService.initialize();
      const current = await dataService.getCurrentUser();
      // Default to student demo user if none
      if (current && current.name !== 'Alex Rivera' && current.email !== 'student@campus.edu') {
        setUser(current);
      } else {
        const defaultStudent = INITIAL_USERS[0];
        await dataService.setCurrentUser(defaultStudent);
        setUser(defaultStudent);
      }
    } catch (e) {
      console.error('Error loading current user:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string) => {
    const users = await dataService.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, message: 'No registered account found with that email.' };
    }
    if (found.status === 'suspended') {
      return { success: false, message: 'This account has been suspended by System Admin.' };
    }
    await dataService.setCurrentUser(found);
    setUser(found);
    return { success: true, message: `Welcome back, ${found.name}!` };
  };

  const register = async (data: {
    name: string;
    email: string;
    role: UserRole;
    department: string;
    rollNumber: string;
  }) => {
    const users = await dataService.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: 'user-' + Date.now(),
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      rollNumber: data.rollNumber,
      joinedClubIds: [],
      registeredEventIds: [],
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    await dataService.updateUser(newUser);
    await dataService.setCurrentUser(newUser);
    setUser(newUser);
    return { success: true, message: 'Account created successfully!' };
  };

  const demoLogin = async (targetRole: UserRole) => {
    setIsLoading(true);
    const users = await dataService.getUsers();
    let demoUser = users.find((u) => u.role === targetRole);
    if (!demoUser) {
      demoUser = INITIAL_USERS.find((u) => u.role === targetRole) || INITIAL_USERS[0];
      await dataService.updateUser(demoUser);
    }
    await dataService.setCurrentUser(demoUser);
    setUser(demoUser);
    setIsLoading(false);
  };

  const switchRole = async (targetRole: UserRole) => {
    await demoLogin(targetRole);
  };

  const logout = async () => {
    await dataService.setCurrentUser(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!user) return;
    const users = await dataService.getUsers();
    const updated = users.find((u) => u.id === user.id);
    if (updated) {
      setUser({ ...updated });
      await dataService.setCurrentUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        switchRole,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

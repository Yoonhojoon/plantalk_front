
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface User {
  fullName: string;
  email?: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (fullName: string, password: string) => Promise<boolean>;
  signup: (fullName: string, password: string, email?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('plantapp-user');
    const savedAuth = localStorage.getItem('plantapp-auth');
    
    if (savedUser && savedAuth === 'true') {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (fullName: string, password: string): Promise<boolean> => {
    // In a real app, we would make an API call to authenticate
    // For this MVP, we'll just simulate a successful login
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { fullName };
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('plantapp-user', JSON.stringify(user));
        localStorage.setItem('plantapp-auth', 'true');
        resolve(true);
      }, 500);
    });
  };

  const signup = async (fullName: string, password: string, email?: string): Promise<boolean> => {
    // In a real app, we would make an API call to register
    // For this MVP, we'll just simulate a successful signup
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { fullName, email };
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('plantapp-user', JSON.stringify(user));
        localStorage.setItem('plantapp-auth', 'true');
        resolve(true);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('plantapp-user');
    localStorage.removeItem('plantapp-auth');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import * as authApi from '../api/auth';

// Demo mode: set to true to bypass backend API for auth
const DEMO_MODE = false;
const DEMO_USER: User = {
  user_id: 1,
  username: 'Vaibhav',
  email: 'demo@secondbrain.com',
  role: 'user',
  created_at: new Date().toISOString(),
};
const DEMO_TOKEN = 'demo-jwt-token-for-local-dev';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    if (DEMO_MODE) {
      if (email === 'demo@secondbrain.com' && password === 'demo1234') {
        localStorage.setItem('token', DEMO_TOKEN);
        localStorage.setItem('user', JSON.stringify(DEMO_USER));
        setToken(DEMO_TOKEN);
        setUser(DEMO_USER);
        return;
      }
      throw { response: { data: { error: 'Invalid demo credentials. Use demo@secondbrain.com / demo1234' } } };
    }
    const data = await authApi.signin(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const signup = async (username: string, email: string, password: string) => {
    if (DEMO_MODE) {
      const demoUser = { ...DEMO_USER, username, email };
      localStorage.setItem('token', DEMO_TOKEN);
      localStorage.setItem('user', JSON.stringify(demoUser));
      setToken(DEMO_TOKEN);
      setUser(demoUser);
      return;
    }
    const data = await authApi.signup(username, email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

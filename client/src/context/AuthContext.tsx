import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';
import { User, Artisan } from '@/types';

interface AuthContextType {
  user: User | null;
  artisan: Artisan | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('asap_token')
  );
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const response: any = await api.login(email, password);
    const { token: newToken, user: userData, artisan: artisanData } = response.data;

    setToken(newToken);
    setUser(userData);
    setArtisan(artisanData);
    localStorage.setItem('asap_token', newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setArtisan(null);
    localStorage.removeItem('asap_token');
  };

  const checkAuth = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response: any = await api.me(token);
      setUser(response.data.user);
      setArtisan(response.data.artisan);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, artisan, token, loading, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

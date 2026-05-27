import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiClient } from '@/integrations/api/client';

interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'moderator';
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]         = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) { setIsLoading(false); return; }

    apiClient.get('/auth/me')
      .then((u: AuthUser) => setUser(u))
      .catch(() => localStorage.removeItem('auth_token'))
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { token, user: u } = await apiClient.post('/auth/signin', { email, password }, false);
      localStorage.setItem('auth_token', token);
      setUser(u);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Sign-up is disabled on the server; kept here for interface compatibility
  const signUp = async (_email: string, _password: string) => {
    return { error: new Error('Self-registration is disabled. Contact the administrator.') };
  };

  const signOut = async () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin: user?.role === 'admin' || user?.role === 'moderator',
      isLoading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

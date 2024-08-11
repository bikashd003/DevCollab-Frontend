import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import BackendApi from '../Constant/Api';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const handleLogout = async () => {
    try {
      await axios.get(`${BackendApi}/github/logout`);
      setIsAuthenticated(false);
      setAccessToken(null);
    } catch (err) {
      console.error('Logout failed', err);
    }
  }

  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const response = await axios.post(`${BackendApi}/auth/token`, {}, { withCredentials: true });
        setAccessToken(response.data.token);  
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Silent refresh failed', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    silentRefresh();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, setAccessToken, setIsAuthenticated, handleLogout }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import BackendApi from '../Constant/Api';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    console.log('AuthProvider is rendering');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const response = await axios.post(`${BackendApi}/auth/token`, {}, { withCredentials: true });
        setAccessToken(response.data.accessToken);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Silent refresh failed', err);
        setIsAuthenticated(false);
      }
    };

    silentRefresh();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, setAccessToken, setIsAuthenticated }}>
      {children}
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

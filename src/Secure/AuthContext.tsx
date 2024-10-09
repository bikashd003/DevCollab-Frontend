import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import BackendApi from '../Constant/Api';
import { GET_CURRENT_USER_ID } from '../GraphQL/Queries/Profile/Users';
import { useQuery } from '@apollo/client';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => Promise<void>;
  currentUserId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { data } = useQuery(GET_CURRENT_USER_ID);
  useEffect(() => {
    if (data) {
      setCurrentUserId(data.getCurrentUserId);
    }
  }, [data]);
  const handleLogout = async () => {
    try {
      await axios.get(`${BackendApi}/auth/logout`);
      setIsAuthenticated(false);
    } catch (err) {
      // console.error('Logout failed', err);
    }
  };

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${BackendApi}/auth/check-auth`, {
          withCredentials: true,
        });
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, handleLogout, currentUserId }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

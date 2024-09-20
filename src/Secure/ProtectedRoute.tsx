import { Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  element: ReactElement;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/" />;
};

export default ProtectedRoute;

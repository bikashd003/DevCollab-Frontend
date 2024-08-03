import { Navigate } from 'react-router-dom';
import { ReactElement } from 'react';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  element: ReactElement;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const auth = useAuth();

  return auth?.isAuthenticated ?? false ? element : <Navigate to="/" />;
};

export default ProtectedRoute;

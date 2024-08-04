import { Navigate } from 'react-router-dom';
import { ReactElement } from 'react';
import { useAuth } from './AuthContext';

interface PublicRouteProps {
  element: ReactElement;
}

const PublicRoute = ({ element }: PublicRouteProps) => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? element : <Navigate to="/profile/user" />;
};

export default PublicRoute;

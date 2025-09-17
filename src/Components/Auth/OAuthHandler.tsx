import type React from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../Secure/AuthContext';

const OAuthHandler: React.FC = () => {
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    const error = urlParams.get('error');

    if (authStatus === 'success') {
      toast.success('Successfully authenticated!');
      localStorage.setItem('user', JSON.stringify({ isAuthenticate: true }));
      setIsAuthenticated(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      const errorMessages: { [key: string]: string } = {
        github_auth_failed: 'GitHub authentication failed',
        google_auth_failed: 'Google authentication failed',
        github_callback_failed: 'GitHub authentication callback failed',
        google_callback_failed: 'Google authentication callback failed',
      };
      toast.error(errorMessages[error] || 'Authentication failed');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [setIsAuthenticated]);

  return null;
};

export default OAuthHandler;

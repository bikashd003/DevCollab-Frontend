import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import BackendApi from '../Constant/Api';

// Create an axios instance
const api = axios.create({
  baseURL: BackendApi,
  withCredentials: true,
});

const useAxiosInterceptors = () => {
  const { accessToken, setAccessToken, setIsAuthenticated } = useAuth();

  useEffect(() => {
    // Request interceptor to add the access token to headers
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token expiration
    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const response = await axios.post(`${BackendApi}/auth/token`, {}, { withCredentials: true });
            setAccessToken(response.data.token);
            setIsAuthenticated(true);
            originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
            return axios(originalRequest);
          } catch (err) {
            console.error('Failed to refresh token', err);
            setIsAuthenticated(false);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, setAccessToken, setIsAuthenticated]);

  return api;
};

export default useAxiosInterceptors;

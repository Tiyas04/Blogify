import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile on mount to check if already authenticated (via HTTPOnly cookie or Header)
  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth/profile');
      if (response?.success && response?.data) {
        setUser(response.data);
      } else {
        localStorage.removeItem('access_token');
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('access_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response?.tokens?.access_token) {
        localStorage.setItem('access_token', response.tokens.access_token);
      }
      if (response?.success && response?.data) {
        setUser(response.data);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const response = await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response?.tokens?.access_token) {
        localStorage.setItem('access_token', response.tokens.access_token);
      }
      if (response?.success && response?.data) {
        setUser(response.data);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (formData) => {
    try {
      const response = await api.patch('/auth/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response?.success && response?.data) {
        setUser(response.data);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '@/services';

const authContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      getCurrentUser()
        .then(setUser)
        .catch(() => {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    getCurrentUser()
      .then(setUser)
      .catch(() => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
      });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <authContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  return useContext(authContext);
}
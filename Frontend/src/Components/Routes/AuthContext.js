import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const AUTH_EXPIRATION_TIME = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem('isAuthenticated')) || false
  );

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('isAuthenticated'));
    const storedToken = localStorage.getItem('token');
    if (authData) {
      const { authenticated, timestamp } = authData;
      if (authenticated && (new Date().getTime() - timestamp < AUTH_EXPIRATION_TIME)) {
        setIsAuthenticated(!!storedToken); // Check if token exists on load
      } else {
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
      }
    }
  }, []);

  const login = (token) => {
    const decodedToken = jwtDecode(token);
    const timestamp = new Date().getTime();
    localStorage.setItem('isAuthenticated', JSON.stringify({ authenticated: true, timestamp }));
    localStorage.setItem('token', decodedToken); // Store token in localStorage
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token'); // Remove token from localStorage
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
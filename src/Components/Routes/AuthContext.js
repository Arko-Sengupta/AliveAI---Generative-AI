import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const AUTH_EXPIRATION_TIME = 12 * 60 * 60 * 1000;

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
        setIsAuthenticated(!!storedToken);
      } else {
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
      }
    }
  }, []);

  const Login = (token) => {
    const decodedToken = jwtDecode(token);
    const timestamp = new Date().getTime();
    localStorage.setItem('isAuthenticated', JSON.stringify({ authenticated: true, timestamp }));
    localStorage.setItem('token', decodedToken);
    setIsAuthenticated(true);
  };

  const Logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
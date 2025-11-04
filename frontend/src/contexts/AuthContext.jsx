import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { createEcho, disconnectEcho } from '../services/echo';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      createEcho(token);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    const { user, token } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    createEcho(token);

    return user;
  };

  const register = async (name, email, password, password_confirmation) => {
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation
    });
    const { user, token } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    createEcho(token);

    return user;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    disconnectEcho();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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

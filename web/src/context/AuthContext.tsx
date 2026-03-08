import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../services/api';
import { useGetMeQuery, useLogoutMutation } from '../services/userApi';
import { api as movieApi } from '../services/api';
import { useDispatch } from 'react-redux';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const { data: currentUser, isLoading, isError } = useGetMeQuery(undefined, {
    // We use the local 'user' state to decide if we should fetch.
    // This makes the skip react immediately when we set user to null.
    skip: !user,
  });

  const [apiLogout] = useLogoutMutation();

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else if (isError) {
      localStorage.removeItem('user');
      setUser(null);
    }
  }, [currentUser, isError]);

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = async () => {
    // 1. Clear local state immediately to trigger 'skip' in useGetMeQuery
    // and prevent any further refetches of protected data.
    setUser(null);
    localStorage.removeItem('user');

    try {
      // 2. Call the server logout
      await apiLogout().unwrap();
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      // 3. Reset the entire API cache to clear movies, users, etc.
      dispatch(movieApi.util.resetApiState());
    }
  };

  const loading = user ? isLoading : false;
  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

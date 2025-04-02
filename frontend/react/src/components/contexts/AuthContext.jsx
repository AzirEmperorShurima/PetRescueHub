import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra người dùng đã đăng nhập chưa khi component được mount
    const checkLoggedIn = () => {
      try {
        const currentUser = authService.getUserSession();
        console.log("AuthContext - Current user from session:", currentUser);
        
        // Chỉ set user nếu có dữ liệu hợp lệ
        if (currentUser && currentUser.id) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password, rememberMe = true) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      
      if (response && response.user) {
        authService.setUserSession(response.user, response.token, rememberMe);
        setUser(response.user);
        return response.user;
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      if (response && response.user) {
        authService.setUserSession(response.user, response.token);
        setUser(response.user);
        return response.user;
      } else {
        throw new Error('Invalid register response');
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.removeUserSession();
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    if (user && user.id) {
      const updatedUser = { ...user, ...updatedUserData };
      authService.setUserSession(updatedUser, authService.getToken());
      setUser(updatedUser);
      return updatedUser;
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
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

export default AuthContext;
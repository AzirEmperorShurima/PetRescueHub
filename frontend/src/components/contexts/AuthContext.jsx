import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import authService from '../../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm checkLoggedIn tách riêng để rõ ràng hơn
  const checkLoggedIn = useCallback(() => {
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
  }, []);

  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  const login = useCallback(async (emailOrUsername, password, rememberMe = true) => {
    try {
      setLoading(true);
      // Truyền đúng object cho service
      const response = await authService.login({ 
        email: emailOrUsername.includes('@') ? emailOrUsername : undefined,
        username: !emailOrUsername.includes('@') ? emailOrUsername : undefined,
        password
      });
      
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
  }, []);

  const register = useCallback(async (username, email, password) => {
    try {
      setLoading(true);
      const response = await authService.register({ username, email, password });
      
      if (response && response.user) {
        return response.user;
      } else {
        return response; // Trả về response để xử lý OTP
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(async (userId, otp) => {
  setLoading(true);
  const data = await authService.verifyOTP(userId, otp);  // đúng signature :contentReference[oaicite:6]{index=6}
  if (data.success && data.user) {
    authService.setUserSession(data.user, data.token);
    setUser(data.user);
  }
  setLoading(false);
  return data;
}, []);

  const logout = useCallback(() => {
    authService.removeUserSession();
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    if (user && user.id) {
      const updatedUser = { ...user, ...updatedUserData };
      authService.setUserSession(updatedUser, authService.getToken());
      setUser(updatedUser);
      return updatedUser;
    }
    return null;
  }, [user]);

  // Sử dụng useMemo để ghi nhớ giá trị context
  const contextValue = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    verifyOTP
  }), [user, loading, login, register, logout, updateUser, verifyOTP]);

  return (
    <AuthContext.Provider value={contextValue}>
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
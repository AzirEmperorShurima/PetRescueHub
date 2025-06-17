import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import authService from '../../services/auth.service';

const AuthContext = createContext();

function normalizeUser(user) {
  if (!user) return {};
  // Ưu tiên fullname, sau đó fullName, sau đó username
  const fullname = user.fullname || user.fullName || user.username || '';
  return {
    ...user,
    fullname,
    phone: user.phone || (Array.isArray(user.phonenumber) ? user.phonenumber[0] : user.phonenumber) || ''
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm checkLoggedIn tách riêng để rõ ràng hơn
  const checkLoggedIn = useCallback(() => {
    try {
      const currentUser = authService.getUserSession();
      if (currentUser && currentUser.id) {
        setUser(normalizeUser(currentUser));
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
      // Chuẩn hóa dữ liệu đầu vào
      const credentials = {
        email: emailOrUsername.includes('@') ? emailOrUsername : undefined,
        username: !emailOrUsername.includes('@') ? emailOrUsername : undefined,
        password
      };
      
      const response = await authService.login(credentials);
      
      if (response && response.user) {
        const normalizedUser = normalizeUser(response.user);
        authService.setUserSession(normalizedUser, response.token, rememberMe);
        setUser(normalizedUser);
        return normalizedUser;
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
      const userData = { username, email, password };
      const response = await authService.register(userData);
      
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
    try {
      setLoading(true);
      const data = await authService.verifyOTP(otp);
      
      if (data.success && data.user) {
        authService.setUserSession(data.user, data.token);
        setUser(data.user);
      }
      
      return data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Đảm bảo user vẫn bị xóa ngay cả khi có lỗi
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    if (user && user.id) {
      const updatedUser = normalizeUser({ ...user, ...updatedUserData });
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
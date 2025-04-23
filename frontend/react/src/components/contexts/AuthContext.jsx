// import React, { createContext, useState, useContext, useEffect } from 'react';
// import authService from '../../services/auth.service';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Kiểm tra người dùng đã đăng nhập chưa khi component được mount
//     const checkLoggedIn = () => {
//       try {
//         const currentUser = authService.getUserSession();
//         console.log("AuthContext - Current user from session:", currentUser);
        
//         // Chỉ set user nếu có dữ liệu hợp lệ
//         if (currentUser && currentUser.id) {
//           setUser(currentUser);
//         } else {
//           setUser(null);
//         }
//       } catch (error) {
//         console.error('Error checking authentication:', error);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkLoggedIn();
//   }, []);

//   const login = async (email, password, rememberMe = true) => {
//     try {
//       setLoading(true);
//       const response = await authService.login(email, password);
      
//       if (response && response.user) {
//         // Tìm thông tin đầy đủ của user từ mock data
//         const { usersMock } = require('../../mocks/authMock');
//         const fullUserData = usersMock.find(u => u.id === response.user.id);
        
//         // Sử dụng thông tin đầy đủ nếu có, nếu không thì dùng thông tin cơ bản
//         const userData = fullUserData || response.user;
        
//         console.log('Đăng nhập với thông tin đầy đủ:', userData);
        
//         authService.setUserSession(userData, response.token, rememberMe);
//         setUser(userData);
//         return userData;
//       } else {
//         throw new Error('Invalid login response');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (userData) => {
//     try {
//       setLoading(true);
//       const response = await authService.register(userData);
      
//       if (response && response.user) {
//         authService.setUserSession(response.user, response.token);
//         setUser(response.user);
//         return response.user;
//       } else {
//         throw new Error('Invalid register response');
//       }
//     } catch (error) {
//       console.error('Register error:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     authService.removeUserSession();
//     setUser(null);
//   };

//   const updateUser = (updatedUserData) => {
//     if (user && user.id) {
//       const updatedUser = { ...user, ...updatedUserData };
//       authService.setUserSession(updatedUser, authService.getToken());
//       setUser(updatedUser);
//       return updatedUser;
//     }
//     return null;
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export default AuthContext;
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Khi component mount, kiểm tra xem đã có user trong session/localStorage chưa
    const checkLoggedIn = () => {
      try {
        const currentUser = authService.getUserSession();
        console.log("AuthContext - Current user from session:", currentUser);

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
      const response = await authService.login({ email, password });

      if (response && response.user) {
        authService.setUserSession(response.user, rememberMe);
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
        authService.setUserSession(response.user);
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
      authService.setUserSession(updatedUser);
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

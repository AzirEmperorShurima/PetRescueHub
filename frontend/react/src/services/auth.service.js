import { usersMock, loginResponseMock } from '../mocks/authMock';

// Lưu thông tin người dùng đã đăng nhập vào localStorage hoặc sessionStorage
const setUserSession = (user, token, rememberMe = true) => {
  if (!user || !token) {
    console.error("Invalid user or token data:", { user, token });
    return;
  }
  
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('user', JSON.stringify(user));
  storage.setItem('token', token);
  console.log("User session saved:", { user, token, storage: rememberMe ? "localStorage" : "sessionStorage" });
};

// Lấy thông tin người dùng đã đăng nhập từ localStorage hoặc sessionStorage
const getUserSession = () => {
  // Kiểm tra localStorage trước
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log("User found in localStorage:", user);
      return user;
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
    }
  }
  
  // Nếu không có trong localStorage, kiểm tra sessionStorage
  const sessionUserStr = sessionStorage.getItem('user');
  if (sessionUserStr) {
    try {
      const user = JSON.parse(sessionUserStr);
      console.log("User found in sessionStorage:", user);
      return user;
    } catch (e) {
      console.error("Error parsing user from sessionStorage:", e);
    }
  }
  
  console.log("No user found in storage");
  return null;
};

// Lấy token từ localStorage hoặc sessionStorage
const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Xóa thông tin người dùng đã đăng nhập
const removeUserSession = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
  console.log("User session removed");
};

// Giả lập API đăng nhập
const login = async (email, password) => {
  console.log("Login attempt:", { email, password });
  
  // Giả lập delay của API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Tìm người dùng trong mock data
  const user = usersMock.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Tạo bản sao của user và loại bỏ password
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token: 'fake-jwt-token'
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

// Giả lập API đăng ký
const register = async (userData) => {
  console.log("Register attempt:", userData);
  
  // Giả lập delay của API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Kiểm tra email đã tồn tại chưa
  const existingUser = usersMock.find(u => u.email === userData.email);
  
  if (existingUser) {
    throw new Error('Email already exists');
  }
  
  // Tạo người dùng mới
  const newUser = {
    id: usersMock.length + 1,
    name: userData.name || userData.email.split('@')[0],
    email: userData.email,
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    role: 'user',
    createdAt: new Date().toISOString()
  };
  
  // Trong thực tế, bạn sẽ lưu người dùng mới vào database
  // Ở đây chúng ta chỉ giả lập
  
  return {
    user: newUser,
    token: 'fake-jwt-token'
  };
};

const authService = {
  setUserSession,
  getUserSession,
  getToken,
  removeUserSession,
  login,
  register
};

export default authService;
import { usersMock } from '../mocks/authMock';

// Lưu thông tin người dùng đã đăng nhập vào localStorage
const setUserSession = (user, token) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

// Lấy thông tin người dùng đã đăng nhập từ localStorage
const getUserSession = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

// Xóa thông tin người dùng đã đăng nhập khỏi localStorage
const removeUserSession = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Đăng nhập với email và password
const login = async (email, password) => {
  // Giả lập API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = usersMock.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Tạo token giả
    const token = `mock-token-${user.id}-${Date.now()}`;
    
    // Trả về thông tin người dùng (không bao gồm password)
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  }
  
  throw new Error('Email hoặc mật khẩu không chính xác');
};

// Đăng ký người dùng mới
const register = async (email, password) => {
  // Giả lập API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Kiểm tra email đã tồn tại chưa
  const existingUser = usersMock.find(u => u.email === email);
  if (existingUser) {
    throw new Error('Email đã được sử dụng');
  }
  
  // Tạo người dùng mới
  const newUser = {
    id: usersMock.length + 1,
    name: email.split('@')[0], // Tạo tên từ email
    email,
    password,
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    role: 'user',
    createdAt: new Date().toISOString()
  };
  
  // Thêm người dùng mới vào danh sách (trong thực tế sẽ lưu vào database)
  usersMock.push(newUser);
  
  // Tạo token giả
  const token = `mock-token-${newUser.id}-${Date.now()}`;
  
  // Trả về thông tin người dùng (không bao gồm password)
  const { password: _, ...userWithoutPassword } = newUser;
  
  return {
    user: userWithoutPassword,
    token
  };
};

// Đăng nhập với Google
const loginWithGoogle = () => {
  window.open("http://localhost:3000/auth/google", "_self");
};

// Đăng nhập với Apple
const loginWithApple = () => {
  // Giả lập đăng nhập với Apple
  alert("Đăng nhập với Apple đang được phát triển");
};

// Đăng nhập với Twitter/X
const loginWithTwitter = () => {
  // Giả lập đăng nhập với Twitter/X
  alert("Đăng nhập với Twitter/X đang được phát triển");
};

const authService = {
  login,
  register,
  setUserSession,
  getUserSession,
  removeUserSession,
  loginWithGoogle,
  loginWithApple,
  loginWithTwitter
};

export default authService;
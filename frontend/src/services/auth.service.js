// auth.service.js
import axios from 'axios';
import api from '../utils/axios'; // dùng axios có xử lý refresh

const setUserSession = (user, token, rememberMe = true) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('user', JSON.stringify(user));
  storage.setItem('token', token);
};

const getUserSession = () => {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

const removeUserSession = () => {
  localStorage.clear();
  sessionStorage.clear();
};

const login = async ({ username, email, password }) => {
  const res = await axios.post(`http://localhost:4000/api/auth/access/login`, {
    username,
    email,
    password
  }, { withCredentials: true });

  return res.data; // { user, message }
};

const register = async ({ username, email, password }) => {
  const res = await api.post('/auth/sign/signup', { username, email, password });
  return res.data;
};

const sendOTP = async (email, type) => {
  const res = await api.post('/auth/otp/send', { email, type });
  return res.data;
};

// Gửi payload { userId, otp } theo API backend :contentReference[oaicite:5]{index=5}
const verifyOTP = async (userId, otp) => {
    const token = getToken();
    const res = await api.post(
      '/auth/sign/verify-otp',
      { userId, otp },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;  // { success, user, token }
  };

export default {
  setUserSession,
  getUserSession,
  getToken,
  removeUserSession,
  login,
  register,
  sendOTP,
  verifyOTP
};

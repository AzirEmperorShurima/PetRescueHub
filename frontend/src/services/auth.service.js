// auth.service.js
import apiService from './api.service';
import Cookies from 'js-cookie'; // Thêm js-cookie

const COOKIE_OPTIONS = {
  // Secure: true nếu dùng HTTPS
  secure: true, 
  sameSite: 'Strict',
  path: '/', 
  expires: 7 // 7 ngày (nếu rememberMe)
};

const setUserSession = (user, token, rememberMe = true) => {
  const options = rememberMe ? { ...COOKIE_OPTIONS, expires: 7 } : { ...COOKIE_OPTIONS };
  Cookies.set('user', JSON.stringify(user), options);
  Cookies.set('token', token, options);
};

const getUserSession = () => {
  const userStr = Cookies.get('user');
  return userStr ? JSON.parse(userStr) : null;
};

const getToken = () => {
  return Cookies.get('token') || null;
};

const removeUserSession = () => {
  Cookies.remove('user', { path: '/' });
  Cookies.remove('token', { path: '/' });
};

const login = async ({ username, email, password }) => {
  const res = await apiService.auth.login({ username, email, password });
  return res.data; // { user, message }
};

const register = async ({ username, email, password }) => {
  const res = await apiService.auth.register({ username, email, password });
  return res.data;
};

const verifyOTP = async (otp) => {
  const res = await apiService.auth.verifyOTP(otp);
  return res.data; // { success, user, token }
};

export default {
  setUserSession,
  getUserSession,
  getToken,
  removeUserSession,
  login,
  register,
  verifyOTP
};

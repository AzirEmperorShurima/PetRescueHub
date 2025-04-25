// auth.service.js
import api from '../utils/axios';
import apiService from './api.service';

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
  // Sử dụng apiService thay vì gọi axios trực tiếp
  const res = await apiService.auth.login({ username, email, password });
  return res.data; // { user, message }
};

const register = async ({ username, email, password }) => {
  const res = await apiService.auth.register({ username, email, password });
  return res.data;
};

const sendOTP = async (email, type) => {
  const res = await apiService.auth.sendOTP(email, type);
  return res.data;
};

const verifyOTP = async (userId, otp) => {
  const res = await apiService.auth.verifyOTP(userId, otp);
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

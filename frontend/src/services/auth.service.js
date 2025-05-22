// auth.service.js
import apiService from './api.service';
import Cookies from 'js-cookie';

const COOKIE_OPTIONS = {
  secure: true, 
  sameSite: 'Strict',
  path: '/', 
  expires: 7 // 7 ngày (nếu rememberMe)
};

/**
 * AuthService - Xử lý logic nghiệp vụ liên quan đến xác thực
 * Gọi API và xử lý dữ liệu trả về
 */
class AuthService {
  /**
   * Lưu thông tin phiên người dùng vào cookies
   * @param {Object} user - Thông tin người dùng
   * @param {string} token - Token xác thực
   * @param {boolean} rememberMe - Có lưu lâu dài hay không
   */
  setUserSession(user, token, rememberMe = true) {
    const options = rememberMe ? { ...COOKIE_OPTIONS, expires: 7 } : { ...COOKIE_OPTIONS };
    Cookies.set('user', JSON.stringify(user), options);
    Cookies.set('token', token, options);
  }

  /**
   * Lấy thông tin người dùng từ cookies
   * @returns {Object|null} Thông tin người dùng hoặc null
   */
  getUserSession() {
    const userStr = Cookies.get('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Lấy token xác thực từ cookies
   * @returns {string|null} Token hoặc null
   */
  getToken() {
    return Cookies.get('token') || null;
  }

  /**
   * Xóa phiên người dùng khỏi cookies
   */
  removeUserSession() {
    Cookies.remove('user', { path: '/' });
    Cookies.remove('token', { path: '/' });
  }

  /**
   * Đăng nhập người dùng
   * @param {Object} credentials - Thông tin đăng nhập
   * @returns {Promise<Object>} Kết quả đăng nhập
   */
  async login(credentials) {
    try {
      const response = await apiService.auth.login(credentials);
      return response.data; // { user, token, message }
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  }

  /**
   * Đăng ký người dùng mới
   * @param {Object} userData - Thông tin đăng ký
   * @returns {Promise<Object>} Kết quả đăng ký
   */
  async register(userData) {
    try {
      const response = await apiService.auth.register(userData);
      return response.data;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  }

  /**
   * Xác thực OTP
   * @param {string} otp - Mã OTP
   * @returns {Promise<Object>} Kết quả xác thực
   */
  async verifyOTP(otp) {
    try {
      const response = await apiService.auth.verifyOTP(otp);
      // Đảm bảo trả về đúng định dạng dữ liệu mà component cần
      return {
        success: true,
        ...response.data
      };
    } catch (error) {
      console.error('Verify OTP API error:', error);
      throw error;
    }
  }

  /**
   * Xác thực OTP cho quên mật khẩu
   * @param {string} otp - Mã OTP
   * @returns {Promise<Object>} Kết quả xác thực
   */
  async otpForgotPassword(otp) {
    try {
      const response = await apiService.auth.otpResetPassword(otp);
      return response.data; // { success, message }
    } catch (error) {
      console.error('OTP Reset Password API error:', error);
      throw error;
    }
  }

  /**
   * Đặt lại mật khẩu
   * @param {string} token - Token xác thực
   * @param {string} password - Mật khẩu mới
   * @returns {Promise<Object>} Kết quả đặt lại mật khẩu
   */
  async resetPassword(newPassword, confirmPassword) {
    try {
      const response = await apiService.auth.resetPassword(newPassword, confirmPassword);
      return response.data;
    } catch (error) {
      console.error('Reset Password API error:', error);
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Đăng xuất người dùng
   * @returns {Promise<Object>} Kết quả đăng xuất
   */
  async logout() {
    try {
      const response = await apiService.auth.logout();
      this.removeUserSession();
      return response.data;
    } catch (error) {
      console.error('Logout API error:', error);
      // Vẫn xóa session ngay cả khi API lỗi
      this.removeUserSession();
      throw error;
    }
  }

  /**
   * Gửi yêu cầu quên mật khẩu
   * @param {string} email - Email người dùng
   * @returns {Promise<Object>} Kết quả gửi yêu cầu
   */
  async forgotPassword(email) {
    try {
      const response = await apiService.auth.forgotPassword(email);
      return response.data;
    } catch (error) {
      console.error('Forgot Password API error:', error);
      throw error;
    }
  }
}

export default new AuthService();

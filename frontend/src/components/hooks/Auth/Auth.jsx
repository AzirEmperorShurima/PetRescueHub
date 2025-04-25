import authService from '../../../services/auth.service';
import { useNavigate } from 'react-router-dom';

// Hàm đăng nhập với đầy đủ thông tin người dùng
const Auth = () => {
  const navigate = useNavigate();
  
  const handleLogin = async (email, password, rememberMe = true) => {
    try {
      // Gọi API đăng nhập thực tế
      const response = await authService.login(email, password);
      
      // Lưu thông tin user và token
      authService.setUserSession(response.user, response.token, rememberMe);
      
      console.log('Đăng nhập thành công với thông tin:', response.user);
      
      // Chuyển hướng đến trang Profile
      navigate('/profile');
      
      return true;
    } catch (error) {
      console.error('Đăng nhập thất bại:', error.message);
      throw error;
    }
  };
  
  return { handleLogin };
};

export default Auth;
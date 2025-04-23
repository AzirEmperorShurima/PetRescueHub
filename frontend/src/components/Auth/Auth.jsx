import { mockLoginWithCredentials } from '../../mocks/authMock';
import { usersMock } from '../../mocks/authMock';
import { useNavigate } from 'react-router-dom';

// Hàm đăng nhập với đầy đủ thông tin người dùng
const Auth = () => {
  const navigate = useNavigate();
  
  const handleLogin = (email, password, rememberMe = true) => {
    try {
      // Sử dụng hàm mockLoginWithCredentials từ authMock
      const response = mockLoginWithCredentials(email, password);
      
      // Tìm thông tin đầy đủ của user từ usersMock để đảm bảo có đầy đủ thông tin
      const fullUserData = usersMock.find(u => u.id === response.user.id);
      
      // Nếu tìm thấy thông tin đầy đủ, sử dụng nó thay vì thông tin cơ bản
      const userData = fullUserData || response.user;
      
      // Lưu thông tin user và token vào localStorage hoặc sessionStorage tùy theo rememberMe
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(userData));
      storage.setItem('token', response.token);
      
      console.log('Đăng nhập thành công với thông tin:', userData);
      
      // Chuyển hướng đến trang Profile
      navigate('/profile');
      
      return true;
    } catch (error) {
      console.error('Đăng nhập thất bại:', error.message);
      return false;
    }
  };
  
  return { handleLogin };
};

export default Auth;
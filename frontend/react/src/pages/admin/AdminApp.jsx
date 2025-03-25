import React, { useEffect, useState } from 'react';
import { useRoutes, useNavigate, useLocation } from 'react-router-dom';
import adminRoutes from '../../routes/adminRoutes';

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const verifyAdminToken = async () => {
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        setIsAuthenticated(false);
        setIsLoading(false);
        
        // Nếu không ở trang login, chuyển hướng đến trang login
        if (location.pathname !== '/admin/login') {
          navigate('/admin/login');
        }
        return;
      }
      
      try {
        // Giả lập xác thực thành công
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        navigate('/admin/login');
        setIsLoading(false);
      }
    };
    
    verifyAdminToken();
  }, [navigate, location.pathname]);
  
  // Hiển thị loading khi đang kiểm tra xác thực
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  // Sử dụng toàn bộ routes, không lọc
  const routing = useRoutes(adminRoutes);
  
  // Nếu chưa đăng nhập và không ở trang login, chuyển hướng đến trang login
  if (!isAuthenticated && location.pathname !== '/admin/login') {
    navigate('/admin/login');
    return null;
  }
  
  // Nếu đã đăng nhập và đang ở trang login, chuyển hướng đến trang dashboard
  if (isAuthenticated && location.pathname === '/admin/login') {
    navigate('/admin');
    return null;
  }
  
  return routing;
};

export default AdminApp;
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '../../components/layouts/AdminLayout';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import PetManagement from './components/PetManagement';
import VolunteerManagement from './components/VolunteerManagement';
import EventManagement from './components/EventManagement';
import DonationManagement from './components/DonationManagement';
import AdminProfile from './components/AdminProfile';
import AdminLogin from './components/AdminLogin';
import RescueManagement from './components/RescueManagement';

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
        
        // Chỉ chuyển hướng nếu không phải đang ở trang login
        if (!location.pathname.includes('/admin/login')) {
          navigate('/admin/login');
        }
        return;
      }
      
      try {
        // Giả lập xác thực thành công
        setIsAuthenticated(true);
        setIsLoading(false);
        
        // Nếu đã đăng nhập và đang ở trang login, chuyển hướng đến dashboard
        if (location.pathname === '/admin/login') {
          navigate('/admin');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate('/admin/login');
      }
    };
    
    verifyAdminToken();
  }, [navigate, location.pathname]);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Sử dụng Routes và Route trực tiếp thay vì useRoutes
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      
      {/* Các route cần xác thực */}
      {isAuthenticated ? (
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="pets" element={<PetManagement />} />
          <Route path="volunteers" element={<VolunteerManagement />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="donations" element={<DonationManagement />} />
          <Route path="rescues" element={<RescueManagement />} /> {/* Thêm route mới */}
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      ) : null}
    </Routes>
  );
};

export default AdminApp;
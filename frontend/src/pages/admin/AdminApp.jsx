import React from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth } from '../../components/contexts/AuthContext';
import AdminLayout from '../../components/layouts/AdminLayout';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import PetManagement from './components/PetManagement';
import VolunteerManagement from './components/VolunteerManagement';
import PostManagement from './components/PostManagement';
import AdminProfile from './components/AdminProfile';
import RescueManagement from './components/RescueManagement';
import ReportManagement from './components/ReportManagement';

const theme = createTheme();

const AdminApp = () => {
  const { user, loading } = useAuth();

  // Kiểm tra quyền admin
  const isAdmin = user && Array.isArray(user.roles)
    ? user.roles.some(r => (typeof r === 'string' ? (r === 'admin' || r === 'super_admin') : (r.name === 'admin' || r.name === 'super_admin')))
    : false;

  if (loading) return <div>Loading...</div>;

  if (!isAdmin) {
    // Nếu không phải admin, chuyển về trang chủ hoặc 404
    return <Navigate to="/" replace />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="pets" element={<PetManagement />} />
          <Route path="volunteers" element={<VolunteerManagement />} />
          <Route path="post" element={<PostManagement />} />
          <Route path="rescues" element={<RescueManagement />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="reports" element={<ReportManagement />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default AdminApp;
import React from 'react';
import { Navigate, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../components/layouts/MainLayout';

// Pages
import Home from '../pages/Home/Home';
import Login from '../features/Auth/Login';
import Register from '../features/Auth/Register';

// Features
import Adopt from '../features/Adopt/Adopt';
import Donate from '../features/Donate/Donate';
import Forum from '../features/Forum/Forum';
import Event from '../features/Event/Event';

// Admin
import AdminApp from '../pages/admin';

/**
 * Cấu trúc routes chính của ứng dụng
 * Được sử dụng trong App.js
 */
const AppRoutes = () => [
  // Main Routes với MainLayout
  <Route key="main" path="/" element={<MainLayout />}>
    <Route index element={<Home />} />
    <Route path="adopt" element={<Adopt />} />
    <Route path="donate" element={<Donate />} />
    <Route path="forum" element={<Forum />} />
    <Route path="event" element={<Event />} />
    <Route path="auth/login" element={<Login />} />
    <Route path="auth/register" element={<Register />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Route>,
  
  // Admin Routes
  <Route key="admin" path="/admin/*" element={<AdminApp />} />
];

export default AppRoutes;
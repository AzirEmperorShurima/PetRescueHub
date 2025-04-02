import React from 'react';
import { Navigate, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../../components/layouts/MainLayout';

// Pages
import Home from '../../pages/Home/Home';
import Forum from '../../pages/Forum/Forum';
import Event from '../../pages/Event/Event';
import Adopt from '../../pages/Adopt/Adopt';
import Donate from '../../pages/Donate/Donate';

import Login from '../../features/Auth/Login';
import Register from '../../features/Auth/Register';
// Forum components
import CreatePost from '../../features/Forum/CreatePost';
import CreateQuestion from '../../features/Forum/CreateQuestion';
import PostDetail from '../../features/Forum/PostDetail';
import QuestionDetail from '../../features/Forum/QuestionDetail';

// Event components
import CreateEvent from '../../features/Event/CreateEvent';
import EventDetail from '../../features/Event/EventDetail';

// User components
import Profile from '../../pages/Profile/Profile';
import Terms from '../../pages/Terms/Terms';

// Admin
import AdminApp from '../../pages/admin';

// Auth
import ProtectedRoute from './ProtectedRoute';

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
    
    {/* Public Forum routes */}
    <Route path="forum" element={<Forum />} />
    <Route path="forum/post/:id" element={<PostDetail />} />
    <Route path="forum/question/:id" element={<QuestionDetail />} />
    
    {/* Public Event routes */}
    <Route path="event" element={<Event />} />
    <Route path="event/:id" element={<EventDetail />} />
    
    {/* Auth routes */}
    <Route path="auth/login" element={<Login />} />
    <Route path="auth/register" element={<Register />} />
    <Route path="terms" element={<Terms />} />
    
    {/* Protected routes - require authentication */}
    <Route element={<ProtectedRoute />}>
      {/* Protected Forum routes */}
      <Route path="forum/post/create" element={<CreatePost />} />
      <Route path="forum/question/create" element={<CreateQuestion />} />
      
      {/* Protected Event routes */}
      <Route path="event/create" element={<CreateEvent />} />
      
      {/* User routes */}
      <Route path="profile" element={<Profile />} />
    </Route>
    
    <Route path="*" element={<Navigate to="/" />} />
  </Route>,
  
  // Admin Routes
  <Route key="admin" path="/admin/*" element={<AdminApp />} />
];

export default AppRoutes;
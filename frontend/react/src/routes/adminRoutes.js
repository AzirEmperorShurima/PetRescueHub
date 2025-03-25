import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../pages/admin/layouts/AdminLayout';
import Dashboard from '../pages/admin/pages/Dashboard';
import UserManagement from '../pages/admin/pages/UserManagement';
import PetManagement from '../pages/admin/pages/PetManagement';
import VolunteerManagement from '../pages/admin/pages/VolunteerManagement';
import EventManagement from '../pages/admin/pages/EventManagement';
import DonationManagement from '../pages/admin/pages/DonationManagement';
import AdminProfile from '../pages/admin/pages/AdminProfile';
import AdminLogin from '../pages/admin/pages/AdminLogin';

const adminRoutes = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: '', element: <Dashboard /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'pets', element: <PetManagement /> },
      { path: 'volunteers', element: <VolunteerManagement /> },
      { path: 'events', element: <EventManagement /> },
      { path: 'donations', element: <DonationManagement /> },
      { path: 'profile', element: <AdminProfile /> },
      { path: '*', element: <Navigate to="/admin" replace /> }
    ]
  },
  {
    path: '/admin/login',
    element: <AdminLogin />
  }
];

export default adminRoutes;
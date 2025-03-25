import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import Home from '../pages/Home/Home';
import Login from '../features/Auth/Login';
import Register from '../features/Auth/Register';
import adminRoutes from './adminRoutes';

// Routes configuration
const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      // { path: '/adopt', element: <Adopt /> },
      // { path: '/donate', element: <Donate /> },
      // { path: '/forum', element: <Forum /> },
      // { path: '/event', element: <Event /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/register', element: <Register /> },
      { path: '*', element: <Navigate to="/" /> }
    ]
  },
  ...adminRoutes
];

export default routes;
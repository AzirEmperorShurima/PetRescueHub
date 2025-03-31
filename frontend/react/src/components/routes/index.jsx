import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Lazy loading các components
const Home = React.lazy(() => import('../../pages/Home/Home'));
const Adopt = React.lazy(() => import('../../pages/Adopt/Adopt'));
const Forum = React.lazy(() => import('../../pages/Forum/Forum'));
// ... other imports

const AppRoutes = () => [
  <Route key="main" path="/" element={<MainLayout />}>
    <Route index element={
      <React.Suspense fallback={<div>Loading...</div>}>
        <Home />
      </React.Suspense>
    } />
    {/* ... other routes */}
  </Route>,
  
  <Route key="admin" path="/admin/*" element={<AdminLayout />}>
    {/* ... admin routes */}
  </Route>
];

export default AppRoutes;
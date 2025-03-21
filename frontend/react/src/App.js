import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

// Layouts
import MainLayout from './components/layouts/MainLayout';

// Components
// import Navigation from './components/common/Navigation';
// import TopBar from './components/common/TopBar';


import Home from './pages/Home/Home';
// import Forum from './components/features/forum/Forum';
// import Adoption from './components/features/adoption/Adoption';
// import Rescue from './components/features/rescue/Rescue';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import UserDashboard from './pages/Dashboard/UserDashboard';
import VolunteerDashboard from './pages/Dashboard/VolunteerDashboard';


function App() {
  return (
    <LanguageProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/forum" element={<Forum />} />
            <Route path="/adoption" element={<Adoption />} />
            <Route path="/rescue" element={<Rescue />} />
            <Route path="/rescue/:id" element={<Rescue />} /> */}

            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            {/* <Route path="/dashboard/admin" element={<AdminDashboard />} />
             */}
            <Route path="/dashboard/user" element={<UserDashboard />} />
            <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />

          </Routes>
        </MainLayout>
      </Router>
    </LanguageProvider>
  );
}

export default App;
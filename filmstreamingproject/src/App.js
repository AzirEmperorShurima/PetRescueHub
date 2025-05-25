import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, AuthContext } from './Context/AuthContext';
import LOGIN from './components/Auth/Login';
import HEADER from './components/Header/Header';
import ProtectedRoute from './router/Private/PrivateRouter';
import './reset1.css';
import LOADER from './components/loader/loader';
import HamsterLoader from './components/loader/HamsterLoader';
import VideoList from './components/Media/VideoList';
import VideoDetail from './components/Media/VideoDetail';
import SIDEBAR from './components/SideBar/SideBar';
import NotFound from './components/Error/Public/err';
import './App.css';
import Footer from './components/footer/footers';
import CreateVideoContent from './components/Media/CreateVideoContent';
import Register from './components/Auth/Register/Register';
import EmptyPage from './components/EmptyPage';
import VideoCall from './api/videocall';
// import Notification from './components/Notification'; // Import Notification
// import { registerUser } from './socket'; // Import socket logic
import Notification from './components/Notification/Notification';

function App() {
  const [isNotFound, setIsNotFound] = useState(false);
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('mode') === 'dark';
  });
  const [loading, setLoading] = useState(false);

  const handleDarkLightToogleSwitch = () => {
    const newMode = !mode;
    setMode(newMode);
    localStorage.setItem('mode', newMode ? 'dark' : 'light');
  };

  const fetchData = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const videos = [
    { id: '1', title: 'Video 1', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
    { id: '2', title: 'Video 2', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
    { id: '4', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
    { id: '5', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
    { id: '6', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
    { id: '7', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
    { id: '8', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
    { id: '9', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
    { id: '10', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
    { id: '11', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
    { id: '12', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
    { id: '13', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
  ];

  return (
    <Router>
      <AuthProvider>
        <div className={`App App-Container ${mode ? 'dark-mode' : 'light-mode'}`} id="wrapper">
          <AuthContext.Consumer>
            {({ auth, logout }) => (
              <>
                <HEADER
                  user={auth?.user}
                  onLogout={logout}
                  Authorization={auth?.Authorization}
                  Authentication={true}
                />
                <SIDEBAR mode={mode} handleToggle={handleDarkLightToogleSwitch} />
                <div className="main-body" id="main">
                  {loading ? (
                    <>
                      <div className="loader-container">
                        <LOADER />
                      </div>
                      <div className="hamster-loader-container">
                        <HamsterLoader />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Thêm Notification component */}
                      {auth?.user?._id && <Notification userId={auth.user._id} />}
                      <Routes>
                        <Route exact path="/" element={<EmptyPage />} />
                        <Route
                          path="/products/action/createvideocontent"
                          element={<ProtectedRoute element={CreateVideoContent} />}
                        />
                        <Route path="/Auth/register" element={<Register />} />
                        <Route path="/listVideo/:id" element={<VideoDetail videos={videos} />} />
                        <Route path="/Auth/login" element={<LOGIN />} />
                        <Route path="/listVideo" element={<VideoList videos={videos} />} />
                        <Route path="/callVideo" element={<VideoCall />} />
                        <Route path="*" element={<NotFound Auth={false} />} />
                      </Routes>
                    </>
                  )}
                </div>
                <Footer darkLight={mode} />
              </>
            )}
          </AuthContext.Consumer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
import React, { useState, useEffect, } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './Context/AuthContext';
import LOGIN from './components/Auth/Login';
import HEADER from './components/Header/Header';
import ProtectedRoute from './router/Private/PrivateRouter'
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

  // useEffect(() => {
  //   const a = document.getElementById('wrapper');
    
  //   if (mode) {
  //     a.classList.add('dark-mode');
  //     a.classList.remove('light-mode');
  //   } else {
  //     a.classList.add('light-mode');
  //     a.classList.remove('dark-mode');
  //   }
  // }, [mode]);

  const fetchData = async () => {
    setLoading(true);
    // Giả sử việc tải dữ liệu mất 2 giây
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const videos = [
    { id: '1', title: 'Video 1', src: 'https://www.youtube.com/watch?v=KObR1fhS7nQ' },
    { id: '2', title: 'Video 2', src: 'https://www.youtube.com/watch?v=KObR1fhS7nQ' },
    { id: '4', title: 'Video 3', src: 'https://www.youtube.com/watch?v=KObR1fhS7nQ' },
    { id: '5', title: 'Video 3', src: 'https://www.youtube.com/watch?v=KObR1fhS7nQ' },
    { id: '6', title: 'Video 3', src: 'https://www.youtube.com/watch?v=KObR1fhS7nQ' },
    { id: '7', title: 'Video 3', src: 'https://www.youtube.com/watch?v=KObR1fhS7nQ' },
    { id: '8', title: 'Video 3', src: 'https://www.youtube.com/watch?v=KObR1fhS7nQ' },
    { id: '9', title: 'Video 3', src: 'https://www.youtube.com/watch?v=KObR1fhS7nQ' },
    { id: '10', title: 'Video 3', src: 'https://www.youtube.com/watch?v=KObR1fhS7nQ' },
    { id: '11', title: 'Video 3', src: 'https://www.youtube.com/watch?v=KObR1fhS7nQ' },
    { id: '12', title: 'Video 3', src: 'https://www.youtube.com/watch?v=KObR1fhS7nQ' },
    { id: '13', title: 'Video 3', src: 'https://www.youtube.com/watch?v=KObR1fhS7nQ' },

  ];
  // const location = useLocation();
  // useEffect(() => {
  //   if (location.pathname === '*' || location.pathname === '/404') {
  //     setIsNotFound(true);
  //   } else {
  //     setIsNotFound(false);
  //   }
  // }, [location]);

  return (
    <Router>
      <AuthProvider>
        <div className={`App App-Container ${mode?'dark-mode':"light-mode"}`} id='wrapper'>
          <AuthContext.Consumer>
            {({ auth, logout }) => (
              <>

                <HEADER user={auth?.user} onLogout={logout} Authorization={auth?.Authorization} Authentication={true} />
                <SIDEBAR mode={mode} handleToggle={handleDarkLightToogleSwitch}></SIDEBAR>
                <div className='main-body' id='main'>
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
                    <Routes>
                      <Route exact path='/' element={<EmptyPage />}></Route>
                      <Route path="/products/action/createvideocontent" element={<ProtectedRoute element={CreateVideoContent} />} />
                      <Route path='/Auth/register' element={<Register />}></Route>
                      <Route path="/listVideo/:id" element={<VideoDetail videos={videos} />} />
                      <Route path="/Auth/login" element={<LOGIN />} />
                      <Route path="/listVideo" element={<VideoList videos={videos} />}></Route>
                      <Route path='*' element={<NotFound Auth={false} />}></Route>
                    </Routes>)
                  }

                </div>
                <Footer darkLight={mode}></Footer>

              </>
            )}

          </AuthContext.Consumer>
        </div>

      </AuthProvider>
    </Router>
  );

}

export default App;

// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { AuthProvider, AuthContext } from './Context/AuthContext';
// import LOGIN from './components/Auth/Login';
// import HEADER from './components/Header/Header';
// import ProtectedRoute from './router/Private/PrivateRouter';
// import './reset1.css';
// import LOADER from './components/loader/loader';
// import HamsterLoader from './components/loader/HamsterLoader';
// import VideoList from './components/Media/VideoList';
// import VideoDetail from './components/Media/VideoDetail';
// import SIDEBAR from './components/SideBar/SideBar';
// import NotFound from './components/Error/Public/err';
// import './App.css';
// import Footer from './components/footer/footers';
// import CreateVideoContent from './components/Media/CreateVideoContent';
// import Register from './components/Auth/Register/Register';
// import EmptyPage from './components/EmptyPage';
// import VideoCall from './api/videocall';
// // import Notification from './components/Notification'; // Import Notification
// // import { registerUser } from './socket'; // Import socket logic
// import Notification from './components/Notification/Notification';

// function App() {
//   const [isNotFound, setIsNotFound] = useState(false);
//   const [mode, setMode] = useState(() => {
//     return localStorage.getItem('mode') === 'dark';
//   });
//   const [loading, setLoading] = useState(false);

//   const handleDarkLightToogleSwitch = () => {
//     const newMode = !mode;
//     setMode(newMode);
//     localStorage.setItem('mode', newMode ? 'dark' : 'light');
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const videos = [
//     { id: '1', title: 'Video 1', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
//     { id: '2', title: 'Video 2', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
//     { id: '4', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
//     { id: '5', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
//     { id: '6', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
//     { id: '7', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
//     { id: '8', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
//     { id: '9', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
//     { id: '10', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
//     { id: '11', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
//     { id: '12', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
//     { id: '13', title: 'Video 3', src: 'https://www.youtube.com/watch?v=2vo14Zw_RYo' },
//   ];

//   return (
//     <Router>
//       <AuthProvider>
//         <div className={`App App-Container ${mode ? 'dark-mode' : 'light-mode'}`} id="wrapper">
//           <AuthContext.Consumer>
//             {({ auth, logout }) => (
//               <>
//                 <HEADER
//                   user={auth?.user}
//                   onLogout={logout}
//                   Authorization={auth?.Authorization}
//                   Authentication={true}
//                 />
//                 <SIDEBAR mode={mode} handleToggle={handleDarkLightToogleSwitch} />
//                 <div className="main-body" id="main">
//                   {loading ? (
//                     <>
//                       <div className="loader-container">
//                         <LOADER />
//                       </div>
//                       <div className="hamster-loader-container">
//                         <HamsterLoader />
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       {/* Thêm Notification component */}
//                       {auth?.user?._id && <Notification userId={auth.user._id} />}
//                       <Routes>
//                         <Route exact path="/" element={<EmptyPage />} />
//                         <Route
//                           path="/products/action/createvideocontent"
//                           element={<ProtectedRoute element={CreateVideoContent} />}
//                         />
//                         <Route path="/Auth/register" element={<Register />} />
//                         <Route path="/listVideo/:id" element={<VideoDetail videos={videos} />} />
//                         <Route path="/Auth/login" element={<LOGIN />} />
//                         <Route path="/listVideo" element={<VideoList videos={videos} />} />
//                         <Route path="/callVideo" element={<VideoCall />} />
//                         <Route path="*" element={<NotFound Auth={false} />} />
//                       </Routes>
//                     </>
//                   )}
//                 </div>
//                 <Footer darkLight={mode} />
//               </>
//             )}
//           </AuthContext.Consumer>
//         </div>
//       </AuthProvider>
//     </Router>
//   );
// }
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER = 'http://localhost:8080'; // Đổi nếu khác

function App() {
  const [userId, setUserId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [connected, setConnected] = useState(false);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const socketRef = useRef();
  const peerRef = useRef();
  const localStreamRef = useRef();

  const connectSocket = () => {
    if (!userId) return alert('Nhập userId trước');

    const socket = io(SOCKET_SERVER, {
      auth: { userId },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 Connected to socket');
      setConnected(true);
    });

    socket.on('offer', async ({ from, offer }) => {
      console.log('📨 Nhận offer từ', from);

      const peer = createPeer();
      await peer.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit('answer', { to: from, answer });
    });

    socket.on('answer', async ({ answer }) => {
      console.log('📨 Nhận answer');
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', async ({ candidate }) => {
      console.log('📨 Nhận ICE Candidate');
      try {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error('Lỗi add ICE:', e);
      }
    });
  };

  const createPeer = () => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current.emit('ice-candidate', {
          to: targetId,
          candidate: e.candidate,
        });
      }
    };

    peer.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };

    // Gắn stream
    localStreamRef.current.getTracks().forEach((track) => {
      peer.addTrack(track, localStreamRef.current);
    });

    peerRef.current = peer;
    return peer;
  };

  const startCall = async () => {
    if (!targetId) return alert('Nhập ID người nhận');

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;
    localStreamRef.current = stream;

    const peer = createPeer();

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socketRef.current.emit('offer', {
      to: targetId,
      offer,
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📞 WebRTC Test</h2>

      {!connected && (
        <>
          <input
            placeholder="Nhập userId của bạn"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button onClick={connectSocket}>Kết nối</button>
        </>
      )}

      {connected && (
        <>
          <p>✅ Đã kết nối với ID: {userId}</p>
          <input
            placeholder="ID người nhận..."
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          />
          <button onClick={startCall}>📲 Gọi</button>
        </>
      )}

      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <div>
          <h4>📷 Camera của bạn</h4>
          <video ref={localVideoRef} autoPlay playsInline muted width="300" />
        </div>
        <div>
          <h4>📺 Đối phương</h4>
          <video ref={remoteVideoRef} autoPlay playsInline width="300" />
        </div>
      </div>
    </div>
  );
}

export default App;

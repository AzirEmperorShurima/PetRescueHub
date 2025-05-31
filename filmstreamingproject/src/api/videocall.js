import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './videocall.css'; // Import CSS

const socket = io('http://localhost:8080', {
    auth: {
        privateKey: process.env.REACT_APP_PRIVATE_KEY_SOCKET||"petrescuehub"
    }
});

const VideoCall = ({ currentUserId }) => {
    const [targetUserId, setTargetUserId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [callStatus, setCallStatus] = useState('idle'); // idle, calling, in-call
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);

    // Cấu hình WebRTC
    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' } // Server STUN công cộng
        ]
    };

    // Đăng ký user khi component mount
    useEffect(() => {
        socket.emit('register', currentUserId);

        socket.on('register_success', ({ userId }) => {
            console.log(`Registered successfully as ${userId}`);
        });

        socket.on('error', ({ message }) => {
            console.error('Socket error:', message);
            alert(`Error: ${message}`);
        });

        // Xử lý call_offer
        socket.on('call_offer', async ({ from, offer, roomId: receivedRoomId }) => {
            setRoomId(receivedRoomId);
            setTargetUserId(from);
            setCallStatus('calling');

            await initWebRTC();
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);

            socket.emit('call_answer', {
                toUserId: from,
                answer,
                roomId: receivedRoomId
            });
        });

        // Xử lý call_answer
        socket.on('call_answer', async ({ answer }) => {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            setCallStatus('in-call');
        });

        // Xử lý ice_candidate
        socket.on('ice_candidate', async ({ candidate }) => {
            if (candidate) {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        return () => {
            socket.off('register_success');
            socket.off('call_offer');
            socket.off('call_answer');
            socket.off('ice_candidate');
            socket.off('error');
        };
    }, [currentUserId]);

    // Khởi tạo WebRTC
    const initWebRTC = async () => {
        peerConnectionRef.current = new RTCPeerConnection(configuration);

        // Lấy stream từ camera/mic
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        localVideoRef.current.srcObject = localStreamRef.current;
        localStreamRef.current.getTracks().forEach(track =>
            peerConnectionRef.current.addTrack(track, localStreamRef.current)
        );

        // Xử lý remote stream
        remoteStreamRef.current = new MediaStream();
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
        peerConnectionRef.current.ontrack = (event) => {
            event.streams[0].getTracks().forEach(track =>
                remoteStreamRef.current.addTrack(track)
            );
        };

        // Xử lý ICE candidates
        peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice_candidate', {
                    toUserId: targetUserId,
                    candidate: event.candidate,
                    roomId
                });
            }
        };
    };

    // Bắt đầu cuộc gọi
    const startCall = async () => {
        if (!targetUserId) {
            alert('Vui lòng nhập ID người nhận');
            return;
        }

        const newRoomId = `call_${currentUserId}_${targetUserId}_${Date.now()}`;
        setRoomId(newRoomId);
        setCallStatus('calling');

        socket.emit('join_room', { roomId: newRoomId, userId: currentUserId });

        await initWebRTC();
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);

        socket.emit('call_offer', {
            toUserId: targetUserId,
            offer,
            roomId: newRoomId
        });
    };

    // Kết thúc cuộc gọi
    const endCall = () => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        localVideoRef.current.srcObject = null;
        remoteVideoRef.current.srcObject = null;
        socket.emit('leave_room', { roomId, userId: currentUserId });
        setCallStatus('idle');
        setRoomId('');
        setTargetUserId('');
    };

    return (
        <div className="video-call-container">
            <h2>Video Call</h2>
            <div className="video-section">
                <video ref={localVideoRef} autoPlay playsInline muted />
                <video ref={remoteVideoRef} autoPlay playsInline />
            </div>
            <div className="controls">
                {callStatus === 'idle' && (
                    <div>
                        <label>Target User ID:</label>
                        <input
                            type="text"
                            value={targetUserId}
                            onChange={(e) => setTargetUserId(e.target.value)}
                            placeholder="Enter target user ID"
                        />
                        <button onClick={startCall}>Bắt đầu gọi</button>
                    </div>
                )}
                {callStatus !== 'idle' && (
                    <div>
                        <p>Trạng thái: {callStatus === 'calling' ? 'Đang gọi...' : 'Đang trong cuộc gọi'}</p>
                        <button onClick={endCall}>Kết thúc gọi</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoCall;
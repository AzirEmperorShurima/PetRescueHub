import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const VideoCall = ({ userId, roomId }) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const socketRef = useRef(null);

    const initializeMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setLocalStream(stream);
            localVideoRef.current.srcObject = stream;
        } catch (error) {
            console.error("Không thể truy cập camera/mic:", error);
        }
    };

    const initializePeerConnection = () => {
        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                {
                    urls: 'turn:your-turn-server.com',
                    username: 'username',
                    credential: 'credential'
                }
            ]
        };

        const pc = new RTCPeerConnection(configuration);

        // Thêm local stream vào peer connection
        localStream.getTracks().forEach(track => {
            pc.addTrack(track, localStream);
        });

        // Xử lý remote stream
        pc.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        // Xử lý ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('ice_candidate', {
                    toUserId: roomId, // hoặc ID của người nhận cụ thể
                    candidate: event.candidate,
                    roomId: roomId
                });
            }
        };

        peerConnectionRef.current = pc;
    };

    const createOffer = async () => {
        try {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);

            socketRef.current.emit('call_offer', {
                toUserId: roomId, // hoặc ID của người nhận cụ thể
                offer: offer,
                roomId: roomId
            });
        } catch (error) {
            console.error("Lỗi khi tạo offer:", error);
        }
    };

    const handleCallAnswer = async (answer) => {
        try {
            await peerConnectionRef.current.setRemoteDescription(answer);
        } catch (error) {
            console.error("Lỗi khi xử lý answer:", error);
        }
    };

    const handleIncomingCall = async (offer) => {
        try {
            await peerConnectionRef.current.setRemoteDescription(offer);
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);

            socketRef.current.emit('call_answer', {
                toUserId: roomId, // hoặc ID của người gọi
                answer: answer,
                roomId: roomId
            });
        } catch (error) {
            console.error("Lỗi khi xử lý cuộc gọi đến:", error);
        }
    };

    useEffect(() => {
        // Khởi tạo socket connection
        socketRef.current = io('http://localhost:8000', {
            auth: {
                privateKey: 'your_private_key'
            }
        });

        // Đăng ký người dùng
        socketRef.current.emit('register', userId);

        // Tham gia phòng
        socketRef.current.emit('join_room', { roomId, userId });

        // Khởi tạo media và peer connection
        initializeMedia().then(() => {
            initializePeerConnection();
        });

        // Lắng nghe các sự kiện
        socketRef.current.on('call_offer', ({ from, offer }) => {
            handleIncomingCall(offer);
        });

        socketRef.current.on('call_answer', ({ from, answer }) => {
            handleCallAnswer(answer);
        });

        socketRef.current.on('ice_candidate', ({ from, candidate }) => {
            peerConnectionRef.current.addIceCandidate(candidate);
        });

        return () => {
            // Cleanup khi component unmount
            localStream?.getTracks().forEach(track => track.stop());
            peerConnectionRef.current?.close();
            socketRef.current?.disconnect();
        };
    }, []);

    return (
        <div>
            <div>
                <h3>Local Video</h3>
                <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '300px' }}
                />
            </div>
            <div>
                <h3>Remote Video</h3>
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    style={{ width: '300px' }}
                />
            </div>
            <button onClick={createOffer}>Bắt đầu cuộc gọi</button>
        </div>
    );
};

export default VideoCall;
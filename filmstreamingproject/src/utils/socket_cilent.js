import io from 'socket.io-client';

// Khởi tạo kết nối Socket.IO
const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:8080', {
    auth: {
        privateKey: process.env.REACT_APP_PRIVATE_KEY_SOCKET ||"petrescuehub",
    },
});

// Hàm đăng ký user với server
export const registerUser = (userId, onSuccess, onError) => {
    if (userId) {
        socket.emit('register', userId);

        // Lắng nghe đăng ký thành công
        socket.on('register_success', ({ userId }) => {
            console.log(`Registered successfully for user: ${userId}`);
            if (onSuccess) onSuccess(userId);
        });

        // Lắng nghe lỗi
        socket.on('error', ({ message }) => {
            console.error('Socket error:', message);
            if (onError) onError(message);
        });
    }
};

// Hàm để component khác có thể lắng nghe sự kiện
export const onSocketEvent = (event, callback) => {
    socket.on(event, callback);
};

// Hàm để bỏ lắng nghe sự kiện
export const offSocketEvent = (event, callback) => {
    socket.off(event, callback);
};

// Xuất socket instance để sử dụng trực tiếp nếu cần
export default socket;
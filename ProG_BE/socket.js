import { Server } from "socket.io";
import http from "http";
import NotificationSchema, { createNotificationModel } from "./src/models/NotificationSchema.js";
import User from "./src/models/user.js";


const server = http.createServer();
const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000' },
    pingTimeout: 10000,
    pingInterval: 5000
});
io.Notification = createNotificationModel(io);
const onlineUsers = new Map();
const rooms = new Map();

// Helper functions
const getUserBySocketId = (socketId) => {
    for (let [userId, sockId] of onlineUsers) {
        if (sockId === socketId) return userId;
    }
    return null;
};

const broadcastToRoom = (roomId, event, data, except = null) => {
    const room = rooms.get(roomId);
    if (room) {
        room.participants.forEach(participantId => {
            if (participantId !== except) {
                const socketId = onlineUsers.get(participantId);
                if (socketId) {
                    io.to(socketId).emit(event, data);
                }
            }
        });
    }
};

io.on("connection", (socket) => {
    // const clientKey = socket.handshake.auth.privateKey;
    const clientKey = socket.handshake.headers['privatekey'];
    if (!clientKey || clientKey !== process.env.PRIVATE_KEY_SOCKET) {
        console.error(`[${new Date().toISOString()}] Unauthorized connection attempt: ${socket.id}`);
        socket.disconnect(true);
        return;
    }
    console.log(`[${new Date().toISOString()}] New authorized connection: ${socket.id}`);
    console.log(`[${new Date().toISOString()}] New connection: ${socket.id}`);

    // Đăng ký người dùng
    socket.on("register", (userId) => {
        try {
            onlineUsers.set(userId, socket.id);
            socket.emit("register_success", { userId });
            console.log(`[${new Date().toISOString()}] User registered: ${userId}`);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Register error:`, error);
            socket.emit("error", { message: "Registration failed" });
        }
    });
    // Tạo/Tham gia phòng
    socket.on("join_room", ({ roomId, userId }) => {
        try {
            if (!rooms.has(roomId)) {
                rooms.set(roomId, { participants: new Set(), creator: userId });
            }
            const room = rooms.get(roomId);
            room.participants.add(userId);
            socket.join(roomId);

            socket.to(roomId).emit("user_joined", { userId, roomId });
            socket.emit("room_users", {
                roomId,
                participants: Array.from(room.participants)
            });
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Join room error:`, error);
            socket.emit("error", { message: "Failed to join room" });
        }
    });

    // Xử lý cuộc gọi
    socket.on("call_offer", ({ toUserId, offer, roomId }) => {
        try {
            const targetSocket = onlineUsers.get(toUserId);
            if (targetSocket) {
                const fromUserId = getUserBySocketId(socket.id);
                io.to(targetSocket).emit("call_offer", {
                    from: fromUserId,
                    offer,
                    roomId
                });
            }
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Call offer error:`, error);
            socket.emit("error", { message: "Failed to send call offer" });
        }
    });

    socket.on("call_answer", ({ toUserId, answer, roomId }) => {
        try {
            const targetSocket = onlineUsers.get(toUserId);
            if (targetSocket) {
                const fromUserId = getUserBySocketId(socket.id);
                io.to(targetSocket).emit("call_answer", {
                    from: fromUserId,
                    answer,
                    roomId
                });
            }
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Call answer error:`, error);
            socket.emit("error", { message: "Failed to send call answer" });
        }
    });

    socket.on("ice_candidate", ({ toUserId, candidate, roomId }) => {
        try {
            const targetSocket = onlineUsers.get(toUserId);
            if (targetSocket) {
                const fromUserId = getUserBySocketId(socket.id);
                io.to(targetSocket).emit("ice_candidate", {
                    from: fromUserId,
                    candidate,
                    roomId
                });
            }
        } catch (error) {
            console.error(`[${new Date().toISOString()}] ICE candidate error:`, error);
            socket.emit("error", { message: "Failed to send ICE candidate" });
        }
    });

    // Rời phòng
    socket.on("leave_room", ({ roomId, userId }) => {
        try {
            const room = rooms.get(roomId);
            if (room) {
                room.participants.delete(userId);
                socket.leave(roomId);
                if (room.participants.size === 0) {
                    rooms.delete(roomId);
                } else {
                    broadcastToRoom(roomId, "user_left", { userId, roomId });
                }
            }
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Leave room error:`, error);
        }
    });

    socket.on("disconnect", () => {
        try {
            const userId = getUserBySocketId(socket.id);
            if (userId) {
                rooms.forEach((room, roomId) => {
                    if (room.participants.has(userId)) {
                        room.participants.delete(userId);
                        broadcastToRoom(roomId, "user_left", { userId, roomId });

                        if (room.participants.size === 0) {
                            rooms.delete(roomId);
                        }
                    }
                });

                onlineUsers.delete(userId);
                console.log(`[${new Date().toISOString()}] User disconnected: ${userId}`);
            }
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Disconnect error:`, error);
        }
    });

    socket.on("heartbeat", () => {
        const userId = getUserBySocketId(socket.id);
        const timestamp = new Date().toISOString();
        if (userId) {
            socket.emit("heartbeat_ack", {
                status: "success",
                timestamp,
                userId
            });
        } else {
            socket.emit("heartbeat_ack", {
                status: "unregistered",
                timestamp,
                message: "User not registered"
            });
        }
    });

    socket.on("volunteer_location", async ({ latitude, longitude }) => {
        try {
            const userId = getUserBySocketId(socket.id);
            if (!userId) return;

            const user = await User.findById(userId).select("volunteerStatus");
            if (user?.volunteerStatus === "alreadyRescue") {
                await redisClient.geoAdd("volunteers", {
                    longitude,
                    latitude,
                    member: userId,
                });
                console.log(`[${new Date().toISOString()}] Updated location for volunteer ${userId}`);
            }
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Volunteer location update error:`, error);
        }
    });
});

io.sendNotification = async function (userId, data) {
    const socketId = onlineUsers.get(userId);

    const notification = new NotificationSchema({
        userId,
        ...data,
    });
    await notification.save();

    if (socketId) {
        io.to(socketId).emit("notification", notification);
    }
};

export const startSocketServer = (port) => {
    server.listen(port, () => {
        console.log('\x1b[32m%s\x1b[0m', '┌──────────────────────────────────────────┐');
        console.log('\x1b[32m%s\x1b[0m', '│           Socket Server Started           │');
        console.log('\x1b[32m%s\x1b[0m', '├──────────────────────────────────────────┤');
        console.log('\x1b[32m%s\x1b[0m', `│ Time: ${new Date().toISOString()}    │`);
        console.log('\x1b[32m%s\x1b[0m', `│ Port: ${port}                            │`);
        console.log('\x1b[32m%s\x1b[0m', '└──────────────────────────────────────────┘');
    });
};
export default io;

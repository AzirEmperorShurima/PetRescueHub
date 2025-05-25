import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import socket from '../../utils/socket_cilent';
// import socket from './socket';

const Notification = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const menuRef = useRef(null);

    // Tải thông báo ban đầu từ API
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`/api/notifications?userId=${userId}`);
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        if (userId) {
            fetchNotifications();
        }
    }, [userId]);

    // Lắng nghe thông báo từ Socket.IO
    useEffect(() => {
        const handleNotification = (notification) => {
            setNotifications((prev) => [notification, ...prev]);
        };
        socket.on('notification', handleNotification);

        return () => {
            socket.off('notification', handleNotification);
        };
    }, []);

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Đánh dấu thông báo đã đọc
    const markAsRead = async (notificationId) => {
        try {
            await axios.patch(`/api/notifications/${notificationId}`, { read: true });
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif._id === notificationId ? { ...notif, read: true } : notif
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Đếm số thông báo chưa đọc
    const unreadCount = notifications.filter((notif) => !notif.read).length;

    return (
        <div className="relative" ref={menuRef}>
            {/* Icon thông báo */}
            <button
                onClick={toggleMenu}
                className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none relative"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 ۱۷v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Menu thông báo */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-96 overflow-y-auto">
                    <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-800">Thông báo</h3>
                        {notifications.length === 0 ? (
                            <p className="text-sm text-gray-500 mt-2">Chưa có thông báo nào.</p>
                        ) : (
                            <ul className="mt-2 space-y-2">
                                {notifications.map((notif) => (
                                    <li
                                        key={notif._id}
                                        className={`text-sm border-b border-gray-100 pb-2 ${notif.read ? 'text-gray-600' : 'text-gray-800 font-medium'
                                            }`}
                                        onClick={() => !notif.read && markAsRead(notif._id)}
                                    >
                                        <span>{notif.title}</span>: {notif.message}
                                        <span className="block text-xs text-gray-400">
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-200">
                        <button className="w-full text-sm text-blue-600 hover:text-blue-800">
                            Xem tất cả thông báo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notification;
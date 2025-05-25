// // src/context/AuthContext.js
// import React, { createContext, useState } from 'react';
// import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';

// export const AuthContext = createContext();
// export const AuthProvider = ({ children }) => {
//     const [auth, setAuth] = useState(() => {
//         const token = Cookies.get('token');
//         return token ? { token } : null;
//     });

//     const navigate = useNavigate();
//     const handleLogin = async () => {
//         // Gọi function login từ AuthContext
//         await AuthContext.login("username", "password");
//     };
//     const login = (token) => {
//         Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict' });
//         setAuth({ token });
//         navigate('/');
//     };

//     const logout = () => {
//         Cookies.remove('token'); // Xóa cookie token
//         setAuth(null);
//         navigate('/login');
//     };

//     return (
//         <AuthContext.Provider value={{ auth, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
// src / context / AuthContext.js


// context để test
import React, { createContext, useState } from 'react';

export const AuthContext = createContext({
    auth: {
        user: {
            Name: 'Nguyen Van A',
            _id: '1234567890',
            // Các thuộc tính khác của user
        },
        Authorization: {
            role: 'admin',
            // Các thuộc tính khác liên quan đến quyền hạn
        }
    },
    login: () => { },
    logout: () => { }
});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: {
            Name: 'Nguyen Van b',
            // Các thuộc tính khác của user
        },
        Authorization: {
            role: 'admin',
            // Các thuộc tính khác liên quan đến quyền hạn
        }
    });

    const login = (user, authorization) => {
        setAuth({ user, authorization });
    };

    const logout = () => {
        setAuth(null);
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


// import React, { createContext, useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [auth, setAuth] = useState(() => {
//         const token = Cookies.get('token');
//         return token ? { token } : null;
//     });

//     const navigate = useNavigate();

//     const login = (token) => {
//         Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict' });
//         setAuth({ token });
//         navigate('/');
//     };

//     const logout = async () => {
//         try {
//             const token = auth?.token;
//             if (token) {
//                 await revokeTokenOnServer(token);
//             }
//         } catch (error) {
//             console.error('Failed to revoke token:', error);
//         } finally {
//             Cookies.remove('token');
//             setAuth(null);
//             navigate('/login');
//         }
//     };

//     const handleLogin = async (username, password) => {
//         try {
//             const token = await fetchTokenFromServer(username, password);
//             if (token) {
//                 login(token);
//             } else {
//                 console.error('Login failed: No token received');
//             }
//         } catch (error) {
//             console.error('Login failed:', error);
//         }
//     };

//     useEffect(() => {
//         const token = Cookies.get('token');
//         if (token) {
//             setAuth({ token });
//         }
//     }, []);

//     return (
//         <AuthContext.Provider value={{ auth, login, logout, handleLogin }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// const fetchTokenFromServer = async (username, password) => {
//     const response = await fetch('https://example.com/api/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//     });

//     if (!response.ok) {
//         throw new Error('Network response was not ok');
//     }

//     const data = await response.json();
//     return data.token; // Giả sử token nằm trong thuộc tính `token` của JSON response
// };

// //revoked token
// const revokeTokenOnServer = async (token) => {
//     const response = await fetch('https://example.com/api/logout', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//     });

//     if (!response.ok) {
//         throw new Error('Network response was not ok');
//     }
// };

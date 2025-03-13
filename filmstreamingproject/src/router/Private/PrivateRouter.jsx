// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const { auth } = useContext(AuthContext);

    return auth ? <Component {...rest} /> : <Navigate to="/Auth/login" />;
};

export default ProtectedRoute;

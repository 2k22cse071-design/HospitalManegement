import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        // If not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }

    // If logged in, render the children
    return children;
};

export default ProtectedRoute;

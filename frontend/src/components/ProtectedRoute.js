import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check if user exists in localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        // If not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }

    // If logged in, render the component (children)
    return children;
};

export default ProtectedRoute;

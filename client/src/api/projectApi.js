// src/api/projectApi.js
import { Navigate, Outlet } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ requiredRole }) => {
  const storedUser = localStorage.getItem('User'); // Retrieve the user from local storage
  const user = storedUser ? JSON.parse(storedUser) : null; // Parse the user if it exists

  if (!user) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // User is authenticated but doesn't have the required role, redirect to dashboard
    return <Navigate to="/dashboard" />;
  }

  // User is authenticated and has the required role (if any), allow access
  return <Outlet />;
};

export default ProtectedRoute;

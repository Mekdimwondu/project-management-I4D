import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ requiredRole }) => {
  const storedUserToken = localStorage.getItem('User');
  let user = null;

  if (storedUserToken) {
    try {
      user = jwtDecode(storedUserToken);
      console.log('Decoded User:', user);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return <Navigate to="/login" />;
    }
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" />;
  }

  // Temporarily remove this to test if role check is causing issues
  if (requiredRole && user.role !== requiredRole) {
    // console.log(`User role: ${user.role} does not match required role: ${requiredRole}`);
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  requiredRole: PropTypes.string,
};

export default ProtectedRoute;

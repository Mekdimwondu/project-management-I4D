import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';

import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ requiredRole }) => {
  const storedUserToken = localStorage.getItem('User');
  let user = null;

  if (storedUserToken) {
    try {
      user = jwtDecode(storedUserToken);
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }


  return <Outlet />;
};

ProtectedRoute.propTypes = {
  requiredRole: PropTypes.string,
};

export default ProtectedRoute;

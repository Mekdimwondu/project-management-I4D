import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('User'); // Remove the user's authentication status
    navigate('/login'); // Redirect to login page
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default Logout;

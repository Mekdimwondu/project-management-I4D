import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../api/apiService';

const PasswordChange = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const token = new URLSearchParams(window.location.search).get('token');
  
      if (!token) {
        throw new Error('Invalid or missing reset token');
      }
  
      // Log the token and password for debugging
      console.log({ token, newPassword });
  
      const response = await apiService.patch('/users/reset-password', {
        token,
        newPassword,
      });
  
      if (response.status !== 200) {
        throw new Error('Password reset failed');
      }
  
      setSuccess('Password has been reset successfully!');
      navigate('/login');
  
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Change Your Password</h2>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green mb-4">{success}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-semibold mb-2">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue2 text-white rounded-md hover:bg-blue transition duration-200"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordChange;

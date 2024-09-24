import { useNavigate } from 'react-router-dom';

function SessionExpired() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Session Expired</h2>
        <p className="text-gray-700 text-center mb-6">Your session has expired. Please log in again to continue.</p>
        <div className="text-center">
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionExpired;

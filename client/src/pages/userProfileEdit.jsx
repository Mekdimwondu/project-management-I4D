import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchUserById, updateMember } from '../api/userApi'; // Your API functions

function UserProfileEdit() {
  const { memberId } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUserById(memberId);
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };
    getUser();
  }, [memberId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateMember(memberId, user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update user data', error);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <section className="p-6 bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-3xl font-semibold mb-6">Edit User</h1>
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name:</label>
              <input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            
          
            <div>
              <label className="block text-gray-700">Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleBack}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-700 transition duration-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Save
          </button>
        </form>
      </div>
    </section>
  );
}

export default UserProfileEdit;

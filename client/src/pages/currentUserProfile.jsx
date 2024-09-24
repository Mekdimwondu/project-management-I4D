import { fetchUserById } from '../api/userApi';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { useEffect, useState } from 'react';

function CurrentUserProfile() {
  const [user, setUser] = useState(null);
  const { memberId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUserById(memberId); // Call the API to get user data
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };
    getUser();
  }, [memberId]);

  const handleEditClick = () => {
    navigate(`/edit-my/${memberId}`); // Navigate to the edit page with the user ID
  };

  if (!user) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <section className="p-6 bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <div className='flex justify-between items-center mb-6'>
          <h2 className="text-3xl font-semibold text-center mb-6">User Profile</h2>
          <FaEdit 
            className="text-gray-600 cursor-pointer" 
            size={24} 
            onClick={handleEditClick} // Handle click to navigate
          />
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between items-center">
            <div className="sm:w-1/3">
              {/* Placeholder for profile image or additional content */}
            </div>
            <div className="sm:w-2/3 sm:pl-6">
              <h3 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h3>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600">{user.phoneNumber}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4">
            <h4 className="text-xl font-semibold mb-2">Personal Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Gender</p>
                <p>{user.gender}</p>
              </div>
              <div>
                <p className="text-gray-600">Job Type</p>
                <p>{user.jobType}</p>
              </div>
              <div>
                <p className="text-gray-600">Work Type</p>
                <p>{user.workType}</p>
              </div>
              <div>
                <p className="text-gray-600">Experience Level</p>
                <p>{user.experienceLevel}</p>
              </div>
              <div>
                <p className="text-gray-600">Role</p>
                <p>{user.role}</p>
              </div>
              <div>
                <p className="text-gray-600">User Role</p>
                <p>{user.userRole}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4">
            <h4 className="text-xl font-semibold mb-2">Biography</h4>
            <p>{user.bio}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CurrentUserProfile;

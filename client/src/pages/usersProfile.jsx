
import { useParams } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
const users = [
  {
    id: 1,
    profilePicture: 'https://via.placeholder.com/150',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    gender: 'Male',
    jobType: 'Full-Time',
    workType: 'Remote',
    experienceLevel: 'Senior',
    role: 'Developer',
    userRole: 'Admin',
    bio: 'Experienced software developer with a passion for building web applications.',
  },
  // Add more user objects here
];

function UserProfile() {
  const { userId } = useParams();
  const user = users.find((user) => user.id === parseInt(userId));

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <section className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <div className='flex justify-between items-center mb-6'>
        <h2 className="text-3xl font-semibold text-center mb-6">User Profile</h2>
        <FaEdit className="text-gray-600 cursor-pointer" size={24} />
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between items-center">
            <div className="sm:w-1/3">
              <img
                src={user.profilePicture}
                alt="Profile"
                className="rounded-full w-32 h-32 sm:w-48 sm:h-48 object-cover mx-auto sm:mx-0"
              />
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

export default UserProfile;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUser, checkEmailExists } from '../api/userApi'; // Import a hypothetical email check function

function AddMember() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [jobType, setJobType] = useState('');
  const [workType, setWorkType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [role, setRole] = useState(''); // State for role
  const [bio, setBio] = useState('');
  const [errors, setErrors] = useState({}); // Error state to manage validation messages
  const navigate = useNavigate();

  const handleGenderChange = (event) => setGender(event.target.value);
  const handleJobTypeChange = (event) => setJobType(event.target.value);
  const handleWorkTypeChange = (event) => setWorkType(event.target.value);
  const handleExperienceLevelChange = (event) => setExperienceLevel(event.target.value);
  const handleRoleChange = (event) => setRole(event.target.value); // Correctly using handleRoleChange

  const handleBack = () => navigate('/users');

  const validateInputs = async () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!gender.trim()) newErrors.gender = 'Gender is required';
    if (!jobType.trim()) newErrors.jobType = 'Job type is required';
    if (!workType.trim()) newErrors.workType = 'Work type is required';
    if (!experienceLevel.trim()) newErrors.experienceLevel = 'Experience level is required';
    if (!role.trim()) newErrors.role = 'Role is required';
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) newErrors.email = 'Invalid email format';
  
    if (email.trim() && !newErrors.email) {
      try {
        const emailExists = await checkEmailExists(email);
        if (emailExists) newErrors.email = 'Email is already taken';
      } catch (error) {
        console.error('Failed to check email existence:', error.message || error);
        newErrors.email = 'Error checking email availability';
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleAddMember = async () => {
    const isValid = await validateInputs();
    if (!isValid) return;

    const userData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      jobType,
      workType,
      experienceLevel,
      role,
      bio,
    };

    try {
      const newMember = await addUser(userData);
      console.log('Member added:', newMember);
      navigate('/users');
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  return (
    <section className="p-6 bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="bg-white px-20 py-20 rounded-lg shadow-md w-full max-w-6xl">
        <h2 className="text-2xl font-semibold text-center mb-6">Add Member</h2>
        <div className="space-y-4 flex flex-wrap -mx-2">
          <div className="w-full sm:w-1/2 px-2">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className={`w-full px-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className={`w-full px-4 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <input
              type="number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              className={`w-full px-4 py-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.phoneNumber && <span className="text-red-500 text-sm">{errors.phoneNumber}</span>}
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <select
              className={`w-full px-4 py-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                gender === '' ? 'text-gray-400' : 'text-black'
              }`}
              value={gender}
              onChange={handleGenderChange}
            >
              <option value="" disabled hidden>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <select
              className={`w-full px-4 py-2 border ${errors.jobType ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                jobType === '' ? 'text-gray-400' : 'text-black'
              }`}
              value={jobType}
              onChange={handleJobTypeChange}
            >
              <option value="" disabled hidden>
                Select Job Type
              </option>
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
            {errors.jobType && <span className="text-red-500 text-sm">{errors.jobType}</span>}
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <select
              className={`w-full px-4 py-2 border ${errors.workType ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                workType === '' ? 'text-gray-400' : 'text-black'
              }`}
              value={workType}
              onChange={handleWorkTypeChange}
            >
              <option value="" disabled hidden>
                Select Work Type
              </option>
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
            </select>
            {errors.workType && <span className="text-red-500 text-sm">{errors.workType}</span>}
          </div>
          <div className="w-full sm:w-1/2 px-2">
          <select
              className={`w-full px-4 py-2 border ${errors.experienceLevel ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                experienceLevel === '' ? 'text-gray-400' : 'text-black'
              }`}
              value={experienceLevel}
              onChange={handleExperienceLevelChange}
            >
              <option value="" disabled hidden>
                Select Experience Level
              </option>
              <option value="junior">Junior</option>
              <option value="mid-level">Mid-Level</option>
              <option value="senior">Senior</option>
            </select>
            {errors.experienceLevel && <span className="text-red-500 text-sm">{errors.experienceLevel}</span>}
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <select
              className={`w-full px-4 py-2 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                role === '' ? 'text-gray-400' : 'text-black'
              }`}
              value={role}
              onChange={handleRoleChange}
            >
              <option value="" disabled hidden>
                Select Role
              </option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            {errors.role && <span className="text-red-500 text-sm">{errors.role}</span>}
          </div>
          <div className="w-full px-2">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
              className={`w-full px-4 py-2 border ${errors.bio ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.bio && <span className="text-red-500 text-sm">{errors.bio}</span>}
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleAddMember}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Add Member
          </button>
        </div>
      </div>
    </section>
  );
}

export default AddMember;


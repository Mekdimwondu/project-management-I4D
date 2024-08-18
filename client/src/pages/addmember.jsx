import {  useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../api/userApi';


function AddMember() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [jobType, setJobType] = useState('');
  const [workType, setWorkType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const navigate = useNavigate();

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleJobTypeChange = (event) => {
    setJobType(event.target.value);
  };

  const handleWorkTypeChange = (event) => {
    setWorkType(event.target.value);
  };

  const handleExperienceLevelChange = (event) => {
    setExperienceLevel(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleAddMember = async () => {
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
  console.log(userData)
    try {
      
      const newMember = await addUser(userData);

      console.log('Member added:', newMember);
      navigate('/users');
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };
  return (
    <section className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white px-20 py-20 rounded-lg shadow-md w-full max-w-6xl">
        <h2 className="text-2xl font-semibold text-center mb-6">Add Member</h2>
        <div className="space-y-4 flex flex-wrap -mx-2">
          <div className="w-full sm:w-1/2 px-2">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <input
              type="number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              className="w-full px-4 py-2 border border-gray rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <select
              className={`w-full px-4 py-2 border border-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                gender === '' ? 'text-gray' : 'text-black'
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
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <select
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                jobType === '' ? 'text-gray' : 'text-black'
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
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <select
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                workType === '' ? 'text-gray' : 'text-black'
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
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <select
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                experienceLevel === '' ? 'text-gray' : 'text-black'
              }`}
              value={experienceLevel}
              onChange={handleExperienceLevelChange}
            >
              <option value="" disabled hidden>
                Select Experience Level
              </option>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <select
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                role === '' ? 'text-gray' : 'text-black'
              }`}
              value={role}
              onChange={handleRoleChange}
            >
              <option value="" disabled hidden>
                Select Role
              </option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              
            </select>
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Input some bio"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-between space-x-4">
          <button
            type="button"
            className="w-1/2 bg-gray-light text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleAddMember}
            className="w-1/2 bg-blue2 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Member
          </button>
        </div>
      </div>
    </section>
  );
}

export default AddMember;

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setProjectDetails } from '../redux/projectSlice';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

function AddProject() {
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName]=useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [priorityLevel, setPriority] = useState('low');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available users from the backend
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("User"); // Assuming you're storing your JWT in localStorage
  
        const response = await fetch('http://localhost:5000/api/users/users', {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
  
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
  
        const data = await response.json();
        const users = data.map(user => ({
          value: user._id,
          label: user.firstName,
        }));
        setAvailableMembers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchUsers();
  }, []);
  

  const handleNext = () => {
    dispatch(
      setProjectDetails({
        projectName,
        clientName,
        deadline,
        description,
        priorityLevel,
        teamMembers: selectedMembers,
      })
    );
    navigate('/add-task'); // Redirect to AddTask page
  };

  return (
    <section className="p-6 space-y-12">
      <h2 className="text-2xl font-bold mb-4">Create Project</h2>

      <div className="flex space-x-4">
        {/* Left Column */}
        <div className="flex-1 space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
              <label className="block text-lg font-medium text-gray-700">Client Name</label>
            <input
              type="text"
              placeholder="Enter client name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Project Deadline */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Project Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-4">
          {/* Team Selection */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Team Members</label>
            <Select
              isMulti
              value={selectedMembers}
              onChange={setSelectedMembers}
              options={availableMembers}
              placeholder="Select team members"
              className="w-full"
              styles={{
                menu: (provided) => ({
                  ...provided,
                  maxHeight: '150px', // Set maximum height for the dropdown
                  overflowY: 'auto', // Enable vertical scroll if the content exceeds the height
                }),
              }}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Priority</label>
            <select
              value={priorityLevel}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Description */}
      <div className="flex-1">
        <label className="block text-lg font-medium text-gray-700">Project Description</label>
        <textarea
          placeholder="Enter project description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          rows="10"
        ></textarea>
      </div>

      {/* Centered Post Project Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default AddProject;

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setProjectDetails } from '../redux/projectSlice';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

function AddProject() {
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [priorityLevel, setPriority] = useState('low');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [errors, setErrors] = useState({}); // State to store field-specific error messages
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('User');
        const response = await fetch('http://localhost:5000/api/users/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        const data = await response.json();
        const users = data.map((user) => ({
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

  const validateFields = () => {
    const newErrors = {};
    if (!projectName) newErrors.projectName = 'Project name is required';
    if (!clientName) newErrors.clientName = 'Client name is required';
    if (!deadline) newErrors.deadline = 'Deadline is required';
    if (!description) newErrors.description = 'Description is required';
    if (selectedMembers.length === 0) newErrors.selectedMembers = 'Please select at least one team member';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleNext = () => {
    if (validateFields()) {
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
    }
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
              className={`w-full px-4 py-2 border ${
                errors.projectName ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.projectName && (
              <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>
            )}
          </div>

          {/* Client Name */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Client Name</label>
            <input
              type="text"
              placeholder="Enter client name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.clientName ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.clientName && (
              <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>
            )}
          </div>

          {/* Project Deadline */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Project Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.deadline ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.deadline && (
              <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
            )}
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
              className={`w-full ${errors.selectedMembers ? 'border-red-500' : ''}`}
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderColor: errors.selectedMembers ? 'red' : provided.borderColor,
                }),
                menu: (provided) => ({
                  ...provided,
                  maxHeight: '150px',
                  overflowY: 'auto',
                }),
              }}
            />
            {errors.selectedMembers && (
              <p className="text-red-500 text-sm mt-1">{errors.selectedMembers}</p>
            )}
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
          className={`w-full px-4 py-2 border ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
          rows="10"
        ></textarea>
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
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

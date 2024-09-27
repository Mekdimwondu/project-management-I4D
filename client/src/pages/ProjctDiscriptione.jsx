import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { fetchProjectById, updateProjectTeamMembers, updateTaskStatus } from '../api/projectApi';
import {jwtDecode} from 'jwt-decode'; // Corrected import

function ProjectDescription() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [expandedTaskIndex, setExpandedTaskIndex] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Proper state for admin check

  // Check if the user is admin
  useEffect(() => {
    const storedUserToken = localStorage.getItem('User');
    if (storedUserToken) {
      try {
        const user = jwtDecode(storedUserToken);
        if (user.role === 'Admin') {
          setIsAdmin(true); // Set isAdmin to true if user is Admin
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, []); // Run once when the component mounts

  // Fetch project and users data
  useEffect(() => {
    const getProject = async () => {
      try {
        const data = await fetchProjectById(projectId);
        setProject(data);
        setTasks(data.tasks || []);
        setSelectedMembers(data.teamMembers || []);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch project:', error);
        setLoading(false);
      }
    };

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
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    getProject();
    fetchUsers();
  }, [projectId]);

  // Handle team member updates (only if editing and admin)
  useEffect(() => {
    if (isAdmin && isEditingTeam) {
      const updateTeamMembers = async () => {
        try {
          await updateProjectTeamMembers(projectId, selectedMembers);
        } catch (error) {
          console.error('Error updating team members:', error);
        }
      };
      updateTeamMembers();
    }
  }, [selectedMembers, isAdmin, isEditingTeam, projectId]); // Only update when necessary

  const toggleDropdown = (index) => {
    setDropdownVisible(dropdownVisible === index ? null : index);
  };

  const handleTaskClick = (index) => {
    setExpandedTaskIndex(expandedTaskIndex === index ? null : index);
  };

  const calculateAveragePercentage = (tasks) => {
    if (tasks.length === 0) return 0;

    const totalPercentage = tasks.reduce((total, task) => {
      let percentage;
      switch (task.status) {
        case 'Completed':
          percentage = 100;
          break;
        case 'In Progress':
          percentage = 50;
          break;
        case 'Pending':
          percentage = 0;
          break;
        default:
          percentage = 0;
      }
      return total + percentage;
    }, 0);

    return totalPercentage / tasks.length;
  };

  const handleStatusChange = async (taskIndex, newStatus) => {
    const updatedTasks = tasks.map((task, index) => {
      if (index === taskIndex) {
        return { ...task, status: newStatus };
      }
      return task;
    });

    const averagePercentage = calculateAveragePercentage(updatedTasks);

    try {
      setTasks(updatedTasks); // Optimistically update UI
      await updateTaskStatus(projectId, tasks[taskIndex]._id, newStatus);

      const percentageResponse = await fetch(`http://localhost:5000/api/project/${projectId}/completion`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('User')}`,
        },
        body: JSON.stringify({ completionPercentage: averagePercentage }),
      });

      if (!percentageResponse.ok) {
        throw new Error(`Error: ${percentageResponse.statusText}`);
      }

      console.log('Task status and project percentage updated successfully');
    } catch (error) {
      console.error('Error updating task status and project percentage:', error);
      try {
        const data = await fetchProjectById(projectId);
        setTasks(data.tasks || []);
      } catch (fetchError) {
        console.error('Error fetching updated project data:', fetchError);
      }
    }
  };

  const handleTeamMemberChange = (selectedOptions) => {
    setSelectedMembers(selectedOptions); // Update selected members when changed
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>No project found</div>;

  return (
    <section className="p-4">
      <div className="flex flex-col lg:flex-row">
        {/* Left Section - Project Name, Description, and Team Members */}
        <div className="lg:w-3/5 w-full p-4">
          <div className="bg-white p-6 shadow-md rounded-md mb-4">
            <h1 className="text-3xl font-bold mb-4">{project.projectName}</h1>
            <div className="text-gray-700 mb-4">
              {project.description.split(/(?<=[.?!])\s+|(?=\d+\.\s)|(?<=\s["“].*?["”])/g).map((part, index) => (
                <p key={index}>{part}</p>
              ))}
            </div>
          </div>

          {/* Team Members Section */}
          {isAdmin && (
            <div className="bg-white p-6 shadow-md rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Team Members</h2>
                <button
                  onClick={() => setIsEditingTeam(!isEditingTeam)}
                  className="text-blue-500 hover:underline"
                >
                  {isEditingTeam ? 'Cancel' : 'Edit'}
                </button>
              </div>
              {isEditingTeam ? (
                <Select
                  isMulti
                  value={selectedMembers}
                  onChange={handleTeamMemberChange}
                  options={users}
                  placeholder="Select team members"
                  className="w-full"
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      maxHeight: '150px',
                      overflowY: 'auto',
                    }),
                  }}
                />
              ) : (
                <ul className="space-y-2">
                  {project.teamMembers.map((member) => (
                    <li key={member.value} className="text-gray-700">
                      {member.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Right Section - Tasks */}
        <div className="lg:w-2/5 w-full p-4">
          <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
          <ul className="space-y-4">
            {tasks.map((task, index) => (
              <li
                key={task._id}
                className="bg-white p-4 shadow-md rounded-md cursor-pointer"
                onClick={() => handleTaskClick(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={task.status === 'Completed'}
                      onChange={() => handleStatusChange(index, 'Completed')}
                      className="mr-4"
                    />
                    <span>{task.taskName}</span>
                  </div>

                  <span
                    className={`px-2 py-1 rounded-md text-white ${
                      task.status === 'Pending'
                        ? 'bg-yellow-500'
                        : task.status === 'In Progress'
                        ? 'bg-blue-600' 
                        : 'bg-green-500' 
                    }`}
                  >
                    {task.status}
                  </span>

                  <div className="relative">
                    <button
                      className="text-gray-500 hover:text-gray-700 hover:font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(index);
                      }}
                    >
                      Edit
                    </button>
                    {dropdownVisible === index && (
  <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg">
    <button
      className="w-full block px-4 py-2 text-gray-800 hover:bg-gray-200"
      onClick={() => handleStatusChange(index, 'Pending')}
    >
      Pending
    </button>
    <button
      className="w-full block px-4 py-2 text-gray-800 hover:bg-gray-200"
      onClick={() => handleStatusChange(index, 'In Progress')}
    >
      In Progress
    </button>
    <button
      className="w-full block px-4 py-2 text-gray-800 hover:bg-gray-200"
      onClick={() => handleStatusChange(index, 'Completed')}
    >
      Completed
    </button>
  </div>
)}

                  </div>
                </div>
                {expandedTaskIndex === index && (
                  <div className="mt-4 text-gray-600 overflow-auto whitespace-pre-wrap break-words" style={{ maxHeight: '200px' }}>
                    <p>{task.taskDescription}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ProjectDescription;

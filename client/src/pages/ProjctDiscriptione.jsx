import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProjectById, updateTaskStatus } from '../api/projectApi';

function ProjectDescription() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);

  const toggleDropdown = (index) => {
    setDropdownVisible(dropdownVisible === index ? null : index);
  };

  useEffect(() => {
    const getProject = async () => {
      try {
        const data = await fetchProjectById(projectId);
        console.log('Project Data:', data);
        setProject(data);
        setTasks(data.tasks || []);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch project:', error);
        setLoading(false);
      }
    };

    getProject();
  }, [projectId]);

  const handleStatusChange = async (taskIndex, newStatus) => {
    const task = tasks[taskIndex];
  
    // Check if the status is actually changing
    if (task.status === newStatus) {
      return; // No change needed, so return early
    }
  
    try {
      // Update the task status in the backend
      await updateTaskStatus(projectId, task._id, newStatus);
  
      // Update the task status in the state
      const updatedTasks = tasks.map((t, index) => {
        if (index === taskIndex) {
          return { ...t, status: newStatus };
        }
        return t;
      });
  
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>No project found</div>;

  return (
    <section className="p-4">
      <div className="bg-white p-6 shadow-md rounded-md">
        <h1 className="text-3xl font-bold mb-4">{project.projectName}</h1>
        <p className="text-gray-700 mb-4">{project.description}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 mt-6">Tasks</h2>
      <ul className="space-y-4">
        {tasks.map((task, index) => (
          <li key={task._id} className="flex items-center justify-between bg-white p-4 shadow-md rounded-md">
            <div className="flex items-center">
              <input
                type="radio"
                checked={task.status === 'Completed'}
                onChange={() => handleStatusChange(index, 'Completed')}
                className="mr-4"
              />
              <span>{task.taskName}</span>
            </div>

            <span className={`px-2 py-1 rounded-md text-white ${task.status === 'Pending' ? 'bg-yellow-500' : task.status === 'In Progress' ? 'bg-blue' : 'bg-green'}`}>
              {task.status}
            </span>

            <div className="relative">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => toggleDropdown(index)}
              >
                Edit
              </button>
              {dropdownVisible === index && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg">
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                      task.status === 'Pending' ? 'bg-gray' : ''
                    }`}
                    onClick={() => handleStatusChange(index, 'Pending')}
                  >
                    Pending
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                      task.status === 'In Progress' ? 'bg-gray' : ''
                    }`}
                    onClick={() => handleStatusChange(index, 'In Progress')}
                  >
                    In Progress
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                      task.status === 'Completed' ? 'bg-gray' : ''
                    }`}
                    onClick={() => handleStatusChange(index, 'Completed')}
                  >
                    Completed
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProjectDescription;
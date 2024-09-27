import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendProjectData } from '../api/projectApi';

function AddTask() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [errors, setErrors] = useState({ taskInput: '', taskDescription: '', tasks: '' }); // State to manage errors
  const projectDetails = useSelector((state) => state.project);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Project Details:', projectDetails);
  }, [projectDetails]);

  // Function to add a task with validation checks
  const addTask = () => {
    let hasErrors = false;

    // Reset errors before validation
    setErrors({ taskInput: '', taskDescription: '', tasks: '' });

    if (!taskInput.trim()) {
      setErrors((prev) => ({ ...prev, taskInput: 'Task name is required' }));
      hasErrors = true;
    }

    if (!taskDescription.trim()) {
      setErrors((prev) => ({ ...prev, taskDescription: 'Task description is required' }));
      hasErrors = true;
    }

    if (hasErrors) return;

    // If no errors, add the task to the list
    setTasks([
      ...tasks,
      {
        taskName: taskInput.trim(),
        taskDescription: taskDescription.trim(),
      },
    ]);
    setTaskInput('');
    setTaskDescription('');
  };

  // Function to post project with validation check
  const postProject = async () => {
    if (tasks.length === 0) {
      setErrors((prev) => ({ ...prev, tasks: 'At least one task must be added' }));
      return;
    }

    const projectData = {
      ...projectDetails,
      tasks,
    };

    try {
      await sendProjectData(projectData);
      navigate('/project'); // Navigate to project page on success
    } catch (error) {
      console.error('Failed to post project:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Add Tasks for the Project</h2>
      </div>

      <div className="mx-32 space-y-4">
        <label className="block text-lg font-medium text-gray-700">Tasks</label>
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div key={index} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
              <div className="flex flex-col w-full">
                <span className="font-semibold">{index + 1}. {task.taskName}</span>
                <p className="text-sm text-gray-600 mt-1">{task.taskDescription}</p>
              </div>
              <button
                onClick={() => setTasks(tasks.filter((_, i) => i !== index))}
                className="text-red-500 hover:text-red-700 transition duration-200 ml-4"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Error message for tasks validation */}
        {errors.tasks && <div className="text-red-500 mt-2">{errors.tasks}</div>}

        <div className="flex mt-4">
          <div className="w-1/4">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Task name..."
              className={`w-full px-4 py-2 border ${errors.taskInput ? 'border-red-500' : 'border-gray-300'} rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {/* Error message for task name */}
            {errors.taskInput && <div className="text-red-500 mt-1">{errors.taskInput}</div>}
          </div>
          <div className="w-3/4">
            <input
              type="text"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Task description..."
              className={`w-full px-4 py-2 border-t border-b border-r ${errors.taskDescription ? 'border-red-500' : 'border-gray-300'} rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {/* Error message for task description */}
            {errors.taskDescription && <div className="text-red-500 mt-1">{errors.taskDescription}</div>}
          </div>
          <button
            onClick={addTask}
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={postProject}
          className="bg-green-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-600 transition duration-200"
        >
          Post Project
        </button>
      </div>
    </div>
  );
}

export default AddTask;

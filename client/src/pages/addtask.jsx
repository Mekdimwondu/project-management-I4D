import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function AddTask() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [taskDescription, setTaskDescription] = useState(''); // State for task description
  const projectDetails = useSelector((state) => state.project);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Project Details:', projectDetails);
  }, [projectDetails]);

  const addTask = () => {
    if (taskInput.trim() && taskDescription.trim()) {
      setTasks([
        ...tasks, 
        { 
          taskName: taskInput.trim(), 
          taskDescription: taskDescription.trim() // Add task description here
        }
      ]);
      setTaskInput('');
      setTaskDescription(''); // Clear the description field
    }
  };

  const postProject = async () => {
    const projectData = {
      ...projectDetails,
      priorityLevel: projectDetails.priorityLevel,
      tasks, // Assign the tasks array
    };

    try {
      const token = localStorage.getItem('User'); // Assuming you're storing the token in local storage
      console.log('Project Data:', JSON.stringify(projectData));

      const response = await fetch('http://localhost:5000/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Ensure correct string interpolation
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const savedProject = await response.json();
        console.log('Project posted successfully:', savedProject);
        navigate('/project'); // Redirect to the project list page or another page as needed
      } else {
        console.error('Failed to post project:', response.statusText);
      }
    } catch (error) {
      console.error('Error posting project:', error);
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
                <span className="font-semibold">{index + 1}. {task.taskName}</span> {/* Display task name */}
                <p className="text-sm text-gray-600 mt-1">{task.taskDescription}</p> {/* Display task description */}
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

        <div className="flex mt-4">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Task name..."
            className="w-1/4 px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Task description..."
            className="w-3/4 px-4 py-2 border-t border-b border-r border-gray-300 rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={addTask}
            className="ml-4 bg-blue2 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={postProject}
          className="bg-green text-white px-6 py-2 rounded-md shadow-md hover:bg-green-600 transition duration-200"
        >
          Post Project
        </button>
      </div>
    </div>
  );
}

export default AddTask;

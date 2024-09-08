import { useEffect, useState } from 'react';
import { fetchProjects } from '../api/projectApi'; 
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

function Project() {
  const storedUserToken = localStorage.getItem('User');
  let user = null;
  
  if (storedUserToken) {
    try {
      user = jwtDecode(storedUserToken);
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }
  
  const isAdmin = user && user.role === 'Admin';

  const [projects, setProjects] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const navigate = useNavigate();
  
  const handleAddProject = () => {
    navigate('/add-project');
  };

  const toggleDropdown = (index) => {
    setDropdownVisible(dropdownVisible === index ? null : index);
  };

  const handleEdit = (projectId, e) => {
    e.stopPropagation();
    console.log(`Edit project with ID: ${projectId}`);
  };

  const handleDelete = (projectId, e) => {
    e.stopPropagation();
    console.log(`Delete project with ID: ${projectId}`);
  };

  const handleUpdate = (projectId, e) => {
    e.stopPropagation();
    console.log(`Update project with ID: ${projectId}`);
  };

  const clickCard = (projectId) => {
    navigate(`/project/${projectId}`);
  }

  useEffect(() => {
    const getProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    
    getProjects();
  }, []);

  const getCompletionData = (project) => {
    const completedTasks = project.tasks.filter(task => task.status === 'Completed').length;
    const totalTasks = project.tasks.length;
    const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      labels: ['Completed', 'Remaining'],
      datasets: [
        {
          data: [completionPercentage, 100 - completionPercentage],
          backgroundColor: ['#4caf50', '#f44336'],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <section className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        {isAdmin && (
          <button 
            onClick={handleAddProject} 
            className="bg-blue-500 text-white px-5 py-2 rounded-md shadow-lg hover:bg-blue-600 transition duration-200">
            Add New Project
          </button>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">List of Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="bg-white p-5 shadow-lg rounded-lg relative cursor-pointer transform transition-transform duration-300 hover:scale-105 max-w-xs mx-auto"
              onClick={() => clickCard(project._id)}
            ><div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{project.projectName}</h3>
              <div className="relative">
                {isAdmin && (
                  <>
                    <BsThreeDots
                      className="text-gray-600 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(index);
                      }}
                    />
                    {dropdownVisible === index && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => handleEdit(project._id, e)}
                        >
                          Edit
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => handleDelete(project._id, e)}
                        >
                          Delete
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => handleUpdate(project._id, e)}
                        >
                          Update
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          
            <div className="flex flex-wrap gap-4">
              <p className="text-sm text-gray-600">Tasks: {project.tasks.length}</p>
              <p className="text-sm text-gray-700">Priority: {project.priorityLevel}</p>
              <p className="text-sm text-gray-700">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
            </div>
          
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Team Members:</h4>
              <ul className="flex flex-wrap gap-2 text-sm text-gray-600">
                {project.teamMembers.length > 0 ? (
                  project.teamMembers.map((member, i) => (
                    <li key={i} className="bg-gray-200 px-2 py-1 rounded-md">{member.label}</li>
                  ))
                ) : (
                  <li>No team members</li>
                )}
              </ul>
            </div>
          
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Memos:</h4>
              <ul className="text-sm text-gray-600">
                {project.memos.length > 0 ? (
                  project.memos.map((memo, i) => <li key={i}>Memo {i + 1}</li>)
                ) : (
                  <li>No memos available</li>
                )}
              </ul>
            </div>
          </div>
          

              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Completion Status:</h4>
                <div style={{ height: '150px', width: '100%' }}>
                  <Pie data={getCompletionData(project)} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Project;

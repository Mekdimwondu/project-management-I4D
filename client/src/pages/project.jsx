import { useEffect, useState } from 'react';
import { fetchProjects } from '../api/projectApi'; 
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

function Project() {
  const storedUserToken = localStorage.getItem('User'); // Get the token from local storage
  let user = null;
  
  if (storedUserToken) {
    try {
      user = jwtDecode(storedUserToken); // Decode the token to get the user info
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }
  
  const isAdmin = user && user.role === 'Admin';

  const [projects, setProjects] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null); // State for dropdown visibility
  const navigate = useNavigate();
  
  const handleAddProject = () => {
    navigate('/add-project');
  };

  const toggleDropdown = (index) => {
    setDropdownVisible(dropdownVisible === index ? null : index);
  };

  const handleEdit = (projectId,e) => {
    e.stopPropagation();
    console.log(`Edit project with ID: ${projectId}`);
    // Add your edit logic here
  };

  const handleDelete = (projectId,e) => {
    e.stopPropagation();
    console.log(`Delete project with ID: ${projectId}`);
    // Add your delete logic here
  };

  const handleUpdate = (projectId,e) => {
    e.stopPropagation();
    console.log(`Update project with ID: ${projectId}`);
    // Add your update logic here
  };
  const clickCard=(projectId)=>{
    console.log(`card Project with ID:${projectId}`)
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

  return (
    <section className="p-4 space-y-4">
  <div className="flex items-center justify-between mb-4">
    <div className="text-2xl font-bold">Projects</div>
    {isAdmin && (
      <button 
        onClick={handleAddProject} 
        className="bg-blue2 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200">
        Add New Project
      </button>
    )}
  </div>

  <div>
    <h3 className="text-xl font-semibold mb-2">List of Projects</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {projects.map((project, index) => (
        <div 
          key={index} 
          className="bg-white p-4 shadow-md rounded-md relative" 
          onClick={() => clickCard(project._id)}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold ">{project.projectName}</h4>
            <div className="relative">
              {isAdmin && (
                <>
                  <BsThreeDots
                    className="text-gray-500 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      toggleDropdown(index);
                    }}
                  />

                  {dropdownVisible === index && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-dark hover:bg-gray-light"
                        onClick={(e) => handleEdit(project._id, e)}
                      >
                        Edit
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-dark hover:bg-gray-light"
                        onClick={(e) => handleDelete(project._id, e)}
                      >
                        Delete
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-dark hover:bg-gray-light"
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

          <p className="text-sm text-gray-600">Tasks: {project.tasks.length}</p>
          <p className="mt-2 text-gray-700">Priority: {project.priorityLevel}</p>
          <p className="mt-2 text-gray-700">
            Deadline: {new Date(project.deadline).toLocaleDateString()}
          </p>

          <div className="mt-2">
            <h5 className="text-sm font-semibold">Team Members:</h5>
            <ul className="text-sm text-gray">
              {project.teamMembers.map((member, i) => (
                <li key={i}>{member.label}</li>
              ))}
            </ul>
          </div>

          <div className="mt-2">
            <h5 className="text-sm font-semibold">Memos:</h5>
            <ul className="text-sm text-gray-600">
              {project.memos.length > 0 ? (
                project.memos.map((memo, i) => <li key={i}>Memo {i + 1}</li>)
              ) : (
                <li>No memos available</li>
              )}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

  );
}

export default Project;

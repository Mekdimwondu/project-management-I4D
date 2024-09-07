import { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { fetchAssignedProjects } from '../api/projectApi';
import {jwtDecode} from 'jwt-decode';


function Dashboard() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
 

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('User');
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            setUser(decodedToken.id);
          } catch (error) {
            console.error('Failed to decode token:', error);
          }
        } else {
          console.warn('Token not found in local storage');
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
  
    loadData();
  }, []); // Run only once
  
  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        try {
          const projects = await fetchAssignedProjects(user);
          setAssignedProjects(projects);
        } catch (error) {
          console.error('Error fetching projects:', error);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchProjects();
  }, [user]);

  
  const handleDropdownToggle = () => {
    setDropdownVisible(prevState => !prevState);
  };


  return (
    <section className="p-0">
      <nav className="flex items-center bg-white p-4 shadow-md">
        <h4 className="text-lg font-semibold mr-auto">Welcome Back</h4>
        <div className="flex items-center space-x-4">
          <input
            type="search"
            placeholder="Search..."
            className="w-full max-w-52 p-1 border border-slate-700 rounded-full focus:outline-none focus:ring-1 focus:ring-slate-800"
          />
          <FaBell className="text-gray-600 cursor-pointer" size={24} />
          <div className="relative">
            <div className="relative h-9 w-9">
              <img
                src="https://via.placeholder.com/40"
                alt="Avatar"
                className="rounded-full object-cover border border-gray-300 cursor-pointer aspect-square"
                onClick={handleDropdownToggle}
              />
            </div>
            {dropdownVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
               <Link
               to={`/profile/${user}`}
             className="block px-4 py-2 text-gray-800 hover:bg-slate-200 hover:text-lg">
             Profile
             </Link>
                <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-slate-200 hover:text-lg">
                  Settings
                </Link>
                <Link to="/logout" className="block px-4 py-2 text-gray-800 hover:bg-slate-200 hover:text-lg">
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex space-x-6 px-6 pt-6">
        <div className="flex-1 text-white bg-[#402E7A] p-4 shadow-md rounded-md h-32">
          <h5 className="text-lg font-semibold mb-2">Total Projects</h5>
          <p className="text-gray-600">Description for Total Projects</p>
        </div>
        <div className="flex-1 text-white bg-[#3DC2EC] p-4 shadow-md rounded-md h-32">
          <h5 className="text-lg font-semibold mb-2">Upcoming Projects</h5>
          <p className="text-gray-600">Description for Upcoming Projects</p>
        </div>
        <div className="flex-1 text-white bg-[#FFC163] p-4 shadow-md rounded-md h-32">
          <h5 className="text-lg font-semibold mb-2">In Progress Projects</h5>
          <p className="text-gray-600">Description for In Progress Projects</p>
        </div>
      </div>

      <div className="font-bold p-4">Your Tasks</div>
      <div className="bg-white shadow-md rounded-2xl overflow-x-auto mx-5">
        {loading ? (
          <div className="p-4 text-center">Loading projects...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignedProjects.length > 0 ? (
                assignedProjects.map((project) => (
                  <tr key={project._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{project.projectName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(project.deadline).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{project.priorityLevel}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center">
                    No projects assigned to you
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default Dashboard;

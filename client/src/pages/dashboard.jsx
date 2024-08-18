import { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
 function Dashboard() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };
   return (
    <section className="p-0 ">
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
              <Link to="/profile" className="block px-4 py-2 text-gray-800  hover:bg-slate-200 hover:text-lg">Profile</Link>
              <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-slate-200 hover:text-lg">Settings</Link>
              <Link to="/logout" className="block px-4 py-2 text-gray-800 hover:bg-slate-200 hover:text-lg">Logout</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
   
    <div className="flex space-x-6 px-6 pt-6">
        <div className="flex-1 text-white bg-[#402E7A] p-4 shadow-md rounded-md h-32 ">
          <h5 className="text-lg font-semibold  mb-2">Total project</h5>
          <p className="text-gray-600">Description for Card 1</p>
        </div>
        <div className="flex-1  text-white bg-[#3DC2EC] p-4 shadow-md rounded-md h-32">
          <h5 className="text-lg font-semibold mb-2">upcaming  project</h5>
          <p className="text-gray-600">Description for Card 2</p>
        </div>
        <div className="flex-1  text-white bg-[#FFC163] p-4 shadow-md rounded-md h-32">
          <h5 className="text-lg font-semibold mb-2">Inprogress project</h5>
          <p className="text-gray-600">Description for Card 3</p>
        </div>
      </div>
      <div className="font-bold p-4">your tasks</div>
      <div className="bg-white shadow-md rounded-2xl overflow-x-auto mx-5">
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirement</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Project 1</td>
              <td className="px-6 py-4 whitespace-nowrap">Requirement 1</td>
              <td className="px-6 py-4 whitespace-nowrap">2023-12-31</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Project 2</td>
              <td className="px-6 py-4 whitespace-nowrap">Requirement 2</td>
              <td className="px-6 py-4 whitespace-nowrap">2024-01-15</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Project 3</td>
              <td className="px-6 py-4 whitespace-nowrap">Requirement 3</td>
              <td className="px-6 py-4 whitespace-nowrap">2024-02-28</td>
            </tr>
          </tbody>
        </table>
      </div>
  </section>
   )
 }
 
 export default Dashboard
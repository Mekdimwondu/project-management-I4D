import { Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect } from 'react';

function Users() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    // Fetch users from the API
    const fetchUsers = async () => {
        const token = localStorage.getItem('User');
        if (!token) {
            console.error('No token found');
            return;
        }
        
        try {
            const response = await axios.get('http://localhost:5000/api/users/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // Run fetchUsers on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle "Add User" button click
    const handleAddUserClick = () => {
    navigate('/addmember');
  };
  

    // Handle row click to navigate to user details
    const handleRowClick = (userId) => {
        navigate(`/user/${userId}`);
    };

    return (
        <section className="p-4 space-y-4">
            {/* Header Section */}
            <div className="text-2xl font-bold mb-4">Users</div>

            {/* Input and Button Section */}
            <div className="flex space-x-4 mb-4 justify-between">
                <input
                    type="text"
                    placeholder="Enter user details"
                    className="w-1/5 px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleAddUserClick}
                    className="bg-blue2 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                >
                    Add User
                </button>
            </div>

            {/* User List Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-md shadow-md">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-gray-600 font-medium">Name</th>
                            <th className="px-4 py-2 text-left text-gray-600 font-medium">Email</th>
                            <th className="px-4 py-2 text-left text-gray-600 font-medium">Job</th>
                            <th className="px-4 py-2 text-left text-gray-600 font-medium">Role</th>
                            <th className="px-4 py-2 text-left text-gray-600 font-medium">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="cursor-pointer" onClick={() => handleRowClick(user._id)}>
                                <td className="border-t px-4 py-2">{`${user.firstName} ${user.lastName}`}</td>
                                <td className="border-t px-4 py-2">{user.email}</td>
                                <td className="border-t px-4 py-2">{user.job}</td>
                                <td className="border-t px-4 py-2">{user.role}</td>
                                <td className="border-t px-4 py-2">
                                    <button className="bg-red-500 text-white px-2 py-1 rounded-md shadow-md hover:bg-red-600 transition duration-200">
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Outlet />
        </section>
    );
}

export default Users;

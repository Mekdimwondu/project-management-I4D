import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { displayUsers } from '../api/userApi' // Import the centralized API instance

function Users() {
    const [users, setUsers] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('User');
        console.log(token)
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserRole(decodedToken.role); // Set user role
                console.log(decodedToken.role)
            } catch (error) {
                console.error('Failed to decode token:', error);
                navigate('/login'); // If decoding fails, redirect to login
            }
        } else {
            navigate('/login'); // Redirect if no token
        }
    }, [navigate]);

    useEffect(() => {
        if (userRole === 'Admin') {
            console.log('Fetching users as Admin...');
            fetchUsers(); // Use centralized API call
        }
        console.log('User role:', userRole);
    }, [userRole]);

    const fetchUsers = async () => {
        try {
            const users = await displayUsers(); // Use the centralized API function
            setUsers(users);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleAddUserClick = () => {
        navigate('/addmember');
    };

    const handleRowClick = (memberId) => {
        navigate(`/users/${memberId}`);
    };

    if (!userRole) {
        return <div>Loading...</div>; // Render a loading state while determining role
    }

    if (userRole !== 'Admin') {
        return <div>You do not have permission to view this page.</div>;
    }

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
                    className="bg-blue text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
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

import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { displayUsers, removeUserById } from '../api/userApi'; // Import the API functions

function Users() {
    const [users, setUsers] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [selectedUser, setSelectedUser] = useState(null); // Selected user to delete
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('User');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserRole(decodedToken.role);
            } catch (error) {
                console.error('Failed to decode token:', error);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (userRole === 'Admin') {
            fetchUsers();
        }
    }, [userRole]);

    const fetchUsers = async () => {
        try {
            const usersData = await displayUsers();
            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleAddUserClick = () => {
        navigate('/addmember');
    };

    const handleRowClick = (memberId) => {
        navigate(`/users/${memberId}`); // Navigate to user details
    };

    const handleRemoveClick = (event, user) => {
        event.stopPropagation(); // Prevent row click navigation
        setSelectedUser(user);    // Set the user to be deleted
        setShowModal(true);       // Show confirmation modal
    };

    const handleDeleteUser = async () => {
        try {
            await removeUserById(selectedUser._id); // Call API to delete the user
            setUsers(users.filter((user) => user._id !== selectedUser._id)); // Update user list
            setShowModal(false); // Close modal
            setSelectedUser(null); // Clear selected user
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const closeModal = () => {
        setShowModal(false); // Close the modal without deleting
        setSelectedUser(null); // Clear selected user
    };

    if (!userRole) {
        return <div>Loading...</div>;
    }

    if (userRole !== 'Admin') {
        return <div>You do not have permission to view this page.</div>;
    }

    return (
        <section className="p-4 space-y-4">
            <div className="text-2xl font-bold mb-4">Users</div>

            <div className="flex space-x-4 mb-4 justify-between">
                <input
                    type="text"
                    placeholder="Enter user details"
                    className="w-1/5 px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleAddUserClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                >
                    Add User
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-md shadow-md">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-gray-600 font-medium">Name</th>
                            <th className="px-4 py-2 text-left text-gray-600 font-medium">Email</th>
                            <th className="px-4 py-2 text-left text-gray-600 font-medium">Phone</th>
                            <th className="px-4 py-2 text-left text-gray-600 font-medium">Role</th>
                            <th className="px-4 py-2 text-left text-gray-600 font-medium">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="cursor-pointer" onClick={() => handleRowClick(user._id)}>
                                <td className="border-t px-4 py-2">{`${user.firstName} ${user.lastName}`}</td>
                                <td className="border-t px-4 py-2">{user.email}</td>
                                <td className="border-t px-4 py-2">{user.phoneNumber}</td>
                                <td className="border-t px-4 py-2">{user.role}</td>
                                <td className="border-t px-4 py-2">
                                    <button
                                        onClick={(event) => handleRemoveClick(event, user)} // Stop propagation
                                        className="bg-red-500 text-white px-2 py-1 rounded-md shadow-md hover:bg-red-600 transition duration-200"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete {selectedUser.firstName} {selectedUser.lastName}?</p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={handleDeleteUser}
                                className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Outlet />
        </section>
    );
}

export default Users;

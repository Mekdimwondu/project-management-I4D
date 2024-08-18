import axios from 'axios';

// Create an Axios 
const token = localStorage.getItem('User');
const apiUser = axios.create({
  baseURL: 'http://localhost:5000/api/users/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});

const addUser = async (memberData) => {
  try {
    const response = await apiUser.post('/users', memberData);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error.response || error.message);
    throw error;
  }
};

// Function to get all users
const getMembers = async () => {
  try {
    const response = await apiUser.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error getting users:', error.response || error.message);
    throw error;
  }
};

// Function to update a user
const updateMember = async (memberId, memberData) => {
  try {
    const response = await apiUser.put(`/users${memberId}`, memberData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error.response || error.message);
    throw error;
  }
};

// Function to delete a user
const deleteMember = async (memberId) => {
  try {
    const response = await apiUser.delete(`/users${memberId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error.response || error.message);
    throw error;
  }
};

// Export the functions
export { addUser, getMembers, updateMember, deleteMember };

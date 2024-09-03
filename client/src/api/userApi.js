import apiService from './apiService';

export const displayUsers = async () => {
  try {
    const response = await apiService.get('/users/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const addUser = async (memberData) => {
  try {
    const response = await apiService.post('/users/users', memberData);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error.response || error.message);
    throw error;
  }
};

// Function to get all users
const getMembers = async () => {
  try {
    const response = await apiService.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error getting users:', error.response || error.message);
    throw error;
  }
};

 const updateMember = async (memberId, memberData) => {
  try {
    const response = await apiService.put(`/users/users/${memberId}`, memberData); // Fixed URL
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error.response || error.message);
    throw error;
  }
};

// Delete user
 const deleteMember = async (memberId) => {
  try {
    const response = await apiService.delete(`/users/users/${memberId}`); // Fixed URL
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error.response || error.message);
    throw error;
  }
};
const fetchUserById= async(memberId)=>{
  try {
    const response=await apiService.get(`/users/users/${memberId}`);
    return response.data;
  } catch (error) {
    console.error('error feaching user',error)
    
  }
}

// Export the functions
export { addUser, getMembers, updateMember, deleteMember,fetchUserById };

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
    // Step 1: Create the user
    const response = await apiService.post('/users/users', memberData);

    // Extract the user's email from the response
    const email = response.data.email; 

    // Step 2: Send the password reset request
    const response2 = await apiService.post('/users/request-password-reset', { email });

    // Return both responses in one object
    return {
      createUserResponse: response.data,
      passwordResetResponse: response2.data
    };
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
 const removeUserById = async (memberId) => {
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
export { addUser, getMembers, updateMember, removeUserById,fetchUserById };

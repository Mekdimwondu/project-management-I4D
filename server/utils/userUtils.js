const User = require('../models/user'); // Import the User model

// Function to fetch user emails based on an array of user IDs
const getUserEmails = async (userIds) => {
  // Validate input
  if (!Array.isArray(userIds) || userIds.some(id => !id)) {
    throw new Error('Invalid user IDs provided');
  }

  try {
    // Fetch users from database
    const users = await User.find({ _id: { $in: userIds } });

    // Return an array of email addresses
    return users.map(user => user.email);
  } catch (error) {
    console.error('Error fetching user emails:', error);
    throw new Error('Error fetching user emails');
  }
};

module.exports = { getUserEmails };

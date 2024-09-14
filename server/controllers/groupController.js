const Group = require('../models/groupModel');

// Create a new group
const createGroup = async (req, res) => {
    try {
      console.log('Request body:', req.body);
  
      const { name, members } = req.body;
      const admin = req.user.id; // Assuming `req.user` is set from authentication middleware
  
      if (!name || !members || !admin) {
        console.log('Validation failed: missing fields');
        return res.status(400).json({ message: 'Group name, members, and admin are required' });
      }
  
      const existingGroup = await Group.findOne({ name });
      if (existingGroup) {
        console.log('Group name already exists');
        return res.status(400).json({ message: 'Group name already exists' });
      }
  
      const group = new Group({ name, members, admin });
      console.log('Group data:', group);
  
      await group.save();
  
      res.status(201).json({ message: 'Group created successfully', group });
    } catch (error) {
      console.error('Error creating group:', error);
      res.status(500).json({ message: 'Error creating group', error });
    }
  };

  // Get all groups
  const getGroups = async (req, res) => {
    try {
      const userId = req.user.id; // Get user ID from req.user (from auth middleware)
      const userRole = req.user.role; // Get role from req.user (from auth middleware)
  
      let groups;
  
      if (userRole === 'Admin') {
        // Admins can see all groups
        groups = await Group.find().populate('members', 'firstName lastName');
      } else {
        // Regular users can only see groups they are a member of
        groups = await Group.find({ members: userId }).populate('members', 'firstName lastName');
      }
  
      res.status(200).json(groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
      res.status(500).json({ message: 'Error fetching groups', error });
    }
  };
  
  
  
// Add members to a group
const addMembersToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { members } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    group.members.push(...members);
    await group.save();

    res.status(200).json({ message: 'Members added successfully', group });
  } catch (error) {
    console.error('Error adding members to group:', error);
    res.status(500).json({ message: 'Error adding members to group', error });
  }
};

// Get a group by ID
const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate('members', 'firstName lastName');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error('Error retrieving group:', error);
    res.status(500).json({ message: 'Error retrieving group', error });
  }
};

module.exports = { createGroup,getGroups, addMembersToGroup, getGroupById };

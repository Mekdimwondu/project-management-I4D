const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { createGroup, addMembersToGroup, getGroupById, getGroups } = require('../controllers/groupController');
const router = express.Router();

// Create a group
router.post('/groups',authMiddleware,adminMiddleware, createGroup);
router.get('/groups', authMiddleware, getGroups);;
// Add members to a group
router.post('/:groupId/members',authMiddleware,adminMiddleware, addMembersToGroup);

// Get a group by ID
router.get('/:groupId',authMiddleware,adminMiddleware, getGroupById);

module.exports = router;

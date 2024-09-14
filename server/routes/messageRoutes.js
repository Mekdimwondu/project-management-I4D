const express = require('express');
const { sendMessage, getMessages, replyToMessage } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authmiddleware');

const router = express.Router();

// Route to send a message
router.post('/messages/:groupId', authMiddleware, sendMessage);

// Route to get all messages for a specific group or recipient
router.get('/messages/:groupId?', authMiddleware, getMessages);
router.get('/messages/recipient/:recipientId', authMiddleware, getMessages);

// Route to reply to a message
router.post('/messages/:messageId/reply', authMiddleware, replyToMessage);

module.exports = router;

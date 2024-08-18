// routes/messageRoutes.js
const express = require('express');
const { sendMessage, getMessages, replyToMessage } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authmiddleware');

const router = express.Router();

router.post('/messages', authMiddleware, sendMessage);
router.get('/messages/:projectId', authMiddleware, getMessages);
router.post('/messages/:messageId/reply', authMiddleware, replyToMessage); // New route for replies

module.exports = router;


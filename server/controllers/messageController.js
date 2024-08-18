const Message = require('../models/messageModel');

// Send a message (existing code)
const sendMessage = async (req, res) => {
  try {
    const { content, projectId, attachments } = req.body;
    const userId = req.user._id;

    const message = new Message({
      content,
      project: projectId,
      sender: userId,
      attachments,
    });

    await message.save();

    io.to(projectId).emit('receiveMessage', message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
};

// Reply to a message (new code)
const replyToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const reply = {
      content,
      sender: userId,
    };

    message.replies.push(reply);
    await message.save();

    io.to(message.project).emit('receiveReply', { messageId, reply });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error replying to message', error });
  }
};

// Get all messages for a specific project (existing code)
const getMessages = async (req, res) => {
  try {
    const { projectId } = req.params;

    const messages = await Message.find({ project: projectId })
      .populate('sender', 'firstName lastName')
      .populate('replies.sender', 'firstName lastName');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages', error });
  }
};

module.exports = { sendMessage, replyToMessage, getMessages };

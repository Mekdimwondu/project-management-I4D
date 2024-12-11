const { getIo } = require("../socket"); // Import getIo from socket.js
const User = require("../models/user"); // Import the User model
const Message = require("../models/messageModel");

const sendMessage = async (req, res) => {
  try {
    const { content, groupId, attachments, recipientId } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!content || (!groupId && !recipientId)) {
      return res.status(400).json({
        message: "Content and either groupId or recipientId must be provided",
      });
    }

    // Fetch user information (firstName, lastName)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare message data
    const messageData = {
      content,
      sender: {
        _id: userId,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      attachments: attachments || [],
    };

    // Check if the message is for a group or a recipient
    if (groupId) {
      messageData.group = groupId;
    } else if (recipientId) {
      messageData.recipient = recipientId;
    }

    // Save the message in the database
    const message = new Message(messageData);
    await message.save();

    const targetId = groupId || recipientId;
    const io = getIo();

    // Emit the message to the correct socket room (group or recipient)
    if (io && targetId) {
      io.to(targetId.toString()).emit("receiveMessage", message);
    } else {
      console.error(
        "Socket.IO instance (io) is not defined or no valid targetId found"
      );
    }

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message", error });
  }
};

const replyToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ message: "Reply content is required" });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Add the reply to the message's replies array
    const reply = { content, sender: userId };

    message.replies.push(reply);
    await message.save();

    // Emit the reply to the group or recipient of the original message
    const targetId = message.group || message.recipient.toString();
    const io = getIo();

    if (io && targetId) {
      io.to(targetId).emit("receiveReply", {
        messageId,
        reply,
      });
    } else {
      console.error(
        "Socket.IO instance (io) is not defined or no valid targetId found"
      );
    }

    res.status(201).json(message);
  } catch (error) {
    console.error("Error replying to message:", error);
    res.status(500).json({ message: "Error replying to message", error });
  }
};

const getMessages = async (req, res) => {
  try {
    const { groupId, recipientId } = req.params;

    // Validate input
    if (!groupId && !recipientId) {
      return res.status(400).json({
        message: "Either groupId or recipientId must be provided",
      });
    }

    // Build query based on whether it's a group or direct message
    const query = groupId ? { group: groupId } : { recipient: recipientId };

    // Fetch the messages from the database
    const messages = await Message.find(query)
      .populate("sender", "firstName lastName")
      .populate("replies.sender", "firstName lastName");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ message: "Error retrieving messages", error });
  }
};

module.exports = { sendMessage, replyToMessage, getMessages };

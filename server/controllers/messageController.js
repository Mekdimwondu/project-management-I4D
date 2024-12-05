const { io } = require("../socket"); // Import io from server
const Message = require("../models/messageModel");

const sendMessage = async (req, res) => {
  try {
    const { content, groupId, attachments, recipientId } = req.body;
    const userId = req.user.id;

    if (!content || (!groupId && !recipientId)) {
      return res.status(400).json({
        message: "Content and either groupId or recipientId must be provided",
      });
    }

    const messageData = {
      content,
      sender: userId,
      attachments: attachments || [],
    };

    if (groupId) {
      messageData.group = groupId;
    } else if (recipientId) {
      messageData.recipient = recipientId;
    }

    const message = new Message(messageData);
    await message.save();

    const targetId = groupId || recipientId;
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

    const reply = { content, sender: userId };

    message.replies.push(reply);
    await message.save();

    io.to(message.group || message.recipient.toString()).emit("receiveReply", {
      messageId,
      reply,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error replying to message:", error);
    res.status(500).json({ message: "Error replying to message", error });
  }
};

const getMessages = async (req, res) => {
  try {
    const { groupId, recipientId } = req.params;

    if (!groupId && !recipientId) {
      return res
        .status(400)
        .json({ message: "Either groupId or recipientId must be provided" });
    }

    const query = groupId ? { group: groupId } : { recipient: recipientId };
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

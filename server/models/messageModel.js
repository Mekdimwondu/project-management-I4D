const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure this is required
  attachments: [{ type: String }], // URLs to files, images, etc.
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: false },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  replies: [replySchema], // Array of replies
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;

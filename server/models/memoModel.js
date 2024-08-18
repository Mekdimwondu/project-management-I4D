// models/Memo.js
const mongoose = require('mongoose');

const MemoSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User who created the memo
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // Reference to the associated Project
  createdAt: { type: Date, default: Date.now },
});

const Memo = mongoose.model('Memo', MemoSchema);

module.exports = Memo;

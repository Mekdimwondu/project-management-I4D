
// models/Project.js
const mongoose = require('mongoose');

// Define the Task sub-schema
const TaskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  taskDescription: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to a User
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  dueDate: { type: Date },
});

// Define the Project schema
const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  teamMembers: [{ value: String, label: String, _id: mongoose.Schema.Types.ObjectId }], // Adjust according to what you need
  deadline: { type: Date, required: true },
  priorityLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  completionPercentage: { type: Number, default: 0 },
  description: { type: String },
  tasks: [TaskSchema], // Ensure this matches your frontend
  memos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Memo' }],
}, {
  timestamps: true, 
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;

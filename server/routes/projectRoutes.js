const express = require('express');
const projectRoutes = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { createProject, getProject, updateProject, deleteProject, getProjectById, updateTaskStatus, updateProjectTeamMembers, getAssignedProjects, getCompletionPercentage } = require('../controllers/projectController');

projectRoutes.post('/', authMiddleware, adminMiddleware, createProject);
projectRoutes.get('/', authMiddleware, getProject);
projectRoutes.get('/assigned-projects', authMiddleware, getAssignedProjects);
projectRoutes.get('/:id', authMiddleware, getProjectById);
projectRoutes.put('/:id', authMiddleware, adminMiddleware, updateProject);
projectRoutes.delete('/:id', authMiddleware, adminMiddleware, deleteProject);
projectRoutes.put('/:projectId/tasks/:taskId', updateTaskStatus);
projectRoutes.put('/:projectId/team', authMiddleware,adminMiddleware, updateProjectTeamMembers);
projectRoutes.put('/:projectId/completion', authMiddleware, getCompletionPercentage);
module.exports = projectRoutes;

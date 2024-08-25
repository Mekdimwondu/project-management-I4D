const express = require('express');
const projectRoutes = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { createProject, getProject, updateProject, deleteProject, getProjectById } = require('../controllers/projectController');

projectRoutes.post('/', authMiddleware, adminMiddleware, createProject);
projectRoutes.get('/', authMiddleware, getProject);
projectRoutes.get('/:id', authMiddleware, getProjectById);
projectRoutes.put('/:id', authMiddleware, adminMiddleware, updateProject);
projectRoutes.delete('/:id', authMiddleware, adminMiddleware, deleteProject);

module.exports = projectRoutes;

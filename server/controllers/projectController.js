const Project=require('../models/projectModel');
const { sendUserAssignToProject } = require('../utils/emailService');
const { getUserEmails } = require('../utils/userUtils');
const createProject = async (req, res) => {
  try {
    const { projectName, teamMembers, deadline, priorityLevel, description, tasks } = req.body;

    // Validate required fields
    if (!projectName || !deadline) {
      return res.status(400).json({ message: 'Project name and deadline are required' });
    }

    // Fetch email addresses of team members
    const userIds = teamMembers.map(member => member.value); // Assuming 'value' holds the user ID
    const emails = await getUserEmails(userIds);

    // Create and save the new project
    const project = new Project({
      projectName,
      teamMembers,
      deadline,
      priorityLevel,
      description,
      tasks,
    });

    await project.save();

    // Await the email sending process
    await sendUserAssignToProject(emails, projectName);

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ message: 'Error creating project', error });
  }
};

  const getProject = async (req, res) => {
    try {
      const projects = await Project.find(); 
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  const getProjectById = async (req, res) => {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.status(200).json(project);
    } catch (error) {
      console.error('Error fetching project by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

const updateProject = async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const project = await Project.findById(req.params.id);
  
      if (!project) return res.status(404).send('Project Not Found');
      
      updates.forEach((update) => {
        project[update] = req.body[update];
      });
  
      await project.save();
      res.status(200).send(project);
    } catch (error) {
      res.status(400).send({ message: 'Error updating project', error });
    }
  };
  

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id); 
    if (!project) {
      return res.status(404).send('Project Not Found'); 
    }
    res.status(200).send({ message: 'Project deleted successfully', project });
  } catch (error) {
    res.status(400).send({ message: 'Error deleting project', error }); 
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { status } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = project.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    await project.save();

    res.status(200).json({ message: 'Task status updated', task });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const updateProjectTeamMembers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { teamMembers } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.teamMembers = teamMembers; // Update team members
    await project.save();

    res.status(200).json({ message: 'Team members updated successfully', project });
  } catch (error) {
    console.error('Error updating team members:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const getAssignedProjects = async (req, res) => {
  try {
    const userId = req.user.id; // Convert userId to string for comparison

    console.log("User ID:", userId); // Debugging to ensure userId is retrieved correctly

    // Fetch projects where the logged-in user is part of the team members
    const projects = await Project.find({ 'teamMembers.value': userId });

    // Check if no projects are found
    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects assigned to this user' });
    }

    // Return the list of projects
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching assigned projects:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
const getCompletionPercentage = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const { completionPercentage } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.projectId, 
      { completionPercentage }, 
      { new: true }
    );
    console.log('Updated Project:', project);
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
// src/controllers/projectController.js
const addTaskToProject = async (req, res) => {
  const { projectId } = req.params;
  const { taskName, taskDescription } = req.body; // Match the expected fields

  try {
    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Create a new task
    const newTask = {
      taskName,       // Ensure you use the correct field names
      taskDescription,
      status: 'Pending', // Default status
      createdAt: new Date(),
    };

    // Add the task to the project's task list
    project.tasks.push(newTask);
    await project.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error adding task to project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { createProject,getProject,getProjectById, updateProject,deleteProject,updateTaskStatus,updateProjectTeamMembers,getAssignedProjects,getCompletionPercentage ,addTaskToProject};

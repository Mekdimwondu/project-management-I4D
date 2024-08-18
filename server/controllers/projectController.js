const Project=require('../models/projectModel')

const createProject = async (req, res) => {
  try {
    const {
      projectName, 
      teamMembers,  // Corrected field name
      deadline,  // Corrected field name
      priorityLevel, 
      description,  // Corrected field name
      tasks,
    } = req.body;

    const project = new Project({
      projectName, 
      teamMembers, 
      deadline, 
      priorityLevel, 
      description, 
      tasks,
    });
  
      await project.save();
      res.status(201).send(project);
    } catch (error) {
      res.status(400).send({ message: 'Error creating project', error });
    }
  };
  const getProject = async (req, res) => {
    try {
      const projects = await Project.find(); // Assuming you're using Mongoose
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
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

module.exports = { createProject,getProject, updateProject,deleteProject };

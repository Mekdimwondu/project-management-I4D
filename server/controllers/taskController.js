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
    

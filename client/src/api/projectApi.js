// src/api/projectApi.js
import apiService from './apiService';

export const fetchProjects = async () => {
  try {
    const response = await apiService.get('/project'); // Using the central API service
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};
// In projectApi.js
export const fetchProjectById = async (projectId) => {
  try {
    const response = await apiService.get(`/project/${projectId}`);
    return response.data; // Correct way to access data in axios
  } catch (error) {
    console.error('Failed to fetch project by ID:', error);
    throw error;
  }
};

export const updateTaskStatus = async (projectId, taskId, status) => {
  try {
    const response = await apiService.put(`/project/${projectId}/tasks/${taskId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};
export const updateProjectTeamMembers = async (projectId, updatedMembers) => {
  try {
    console.log('Sending updated members:', updatedMembers);

    const response = await apiService.put(`/project/${projectId}/team`, {
      teamMembers: updatedMembers
    });

    console.log('Response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error updating team members:', error);
    throw error;
  }
}; 
export const sendProjectData = async (project) => {
  const projectData = {
    projectName: project.projectName,
    deadline: project.deadline,
    description: project.description,
    priorityLevel: project.priorityLevel,
    teamMembers: project.teamMembers.map(member => ({
      value: member.value,  // User ID
      label: member.label,  // Role (e.g., "Admin")
      _id: member._id       // Current user's ID
    })),
    tasks: project.tasks,
  };
  try {
    const response = await apiService.post('/project', projectData);
    console.log('Project created successfully:', response.data);
  } catch (error) {
    console.error('Error creating project:', error.response || error.message);
  }
};
export const fetchAssignedProjects = async () => {
  try {
    const response = await apiService.get('/project/assigned-projects'); 
    return response.data; 
  } catch (error) {
    console.error('Error fetching assigned projects:', error);
    throw error; 
  }
};
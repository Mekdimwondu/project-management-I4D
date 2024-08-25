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


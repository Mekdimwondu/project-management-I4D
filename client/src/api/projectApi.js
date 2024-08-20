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


// src/api/projectApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/project'; // Replace with your backend API URL

export const fetchProjects = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('User')}`, // Replace with your token management logic
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

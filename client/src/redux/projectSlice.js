// src/redux/projectSlice.js
import { createSlice } from '@reduxjs/toolkit';

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    projectName: '',
    clientName:'',
    deadline: '',
    description: '',
    priorityLevel: '',
    teamMembers: [],
  },
  reducers: {
    setProjectDetails: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearProjectDetails: () => {
      return {
        projectName: '',
        clientName:'',
        deadline: '',
        description: '',
        priorityLevel: '',
        teamMembers: [],
      };
    },
  },
});

export const { setProjectDetails, clearProjectDetails } = projectSlice.actions;
export default projectSlice.reducer;

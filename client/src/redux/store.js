// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './projectSlice';
import userReducer from './userSlice'
export const store = configureStore({
  reducer: {
    project: projectReducer,
    userData:userReducer
  },
});

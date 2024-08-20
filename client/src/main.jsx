import React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import './index.css';
import Dashboard from './pages/dashboard';
import Message from './pages/message';
import Project from './pages/project';
import Setting from './pages/setting';
import Users from './pages/users';
import Layout from './layout';
import AddMember from './pages/addmember';
import UserProfile from './pages/usersProfile';
import Login from './pages/login';
import ProtectedRoute from './components/ProtectedRoute';
import Logout from './components/logout';
import AddProject from './pages/addProject';
import AddTask from './pages/addtask';
import SessionExpired from './components/SessionExpired'; // Import the SessionExpired component
import { Provider } from 'react-redux';
import { store } from './redux/store';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/logout',
    element: <Logout/>
  },
  {
    path: '/session-expired', // Add a new route for session expiration
    element: <SessionExpired />,
  },
  {
    path: '/',
    element: <ProtectedRoute />, // Protect the routes
    children: [
      {
        path: '/',
        element: <Layout />, // Layout is inside ProtectedRoute
        children: [
          {
            path: '/',
            element: <Navigate to="/dashboard" />,
          },
          {
            path: '/dashboard',
            element: <Dashboard />,
          },
          {
            path: '/project',
            element: <Project />,
          },
          {
            path: '/add-task',
            element: (
              <ProtectedRoute requiredRole="Admin">
                <AddTask />
              </ProtectedRoute>
            ),
          },
          {
            path: '/add-project', // Add the new route here
            element: (
              <ProtectedRoute requiredRole="Admin">
                <AddProject />
              </ProtectedRoute>
            ), // Component for the Add Project page
          },
          {
            path: '/message',
            element: <Message />,
          },
          {
            path: '/users',
            element: (
               <ProtectedRoute requiredRole="Admin">
                <Users />
               </ProtectedRoute>
            ),
          },
          {
            path: '/setting',
            element: <Setting />,
          },
          {
            path: '/addmember',
            element: (
              <ProtectedRoute requiredRole="Admin">
                <AddMember />
              </ProtectedRoute>
            ),
          },
          {
            path: '/user/:userId',
            element: <UserProfile />,
          }
        ],
      }
    ],
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

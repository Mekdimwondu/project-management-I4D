import React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import './index.css';
import Dashboard from './pages/dashboard';
// import Message from './pages/message';
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
import SessionExpired from './components/SessionExpired'; 
import { Provider } from 'react-redux';
import { store } from './redux/store';
import ProjctDiscriptione from './pages/ProjctDiscriptione';
import EditUser from './pages/EditUser';
import Chat from './pages/chat';
import PasswordChange from './components/passwordChange';
import UserProfileEdit from './pages/userProfileEdit';
import CurrentUserProfile from './pages/currentUserProfile';
import ForgotPassword from './components/forgotPassword';
import VerifyCode from './components/verifyCode';
import ResetPassword from './components/resetpassword';

const router = createBrowserRouter([
  {
    path: '/reset-password',
    element: <PasswordChange />, // Ensure you have this component
  },
  {
    path: '/resetPassword',
    element: <ResetPassword />, // Ensure you have this component
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />, // Ensure you have this component
  },
  {
    path: '/verify-code',
    element: <VerifyCode />, // Ensure you have this component
  },

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
          path:'/project/:projectId',
          element:<ProjctDiscriptione/>
          },
          {
            path: '/add-task',
            element: ( 
                <AddTask />
            ),
          },
          {
            path: '/add-project', // Add the new route here
            element: (
                <AddProject />
            ), // Component for the Add Project page
          },
          {
            path: '/message',
            element: <Chat />,
          },
          {
            path: '/users',
            element: (
                 <Users />  
            ),
          },
          {
            path: '/setting',
            element: <Setting />,
          },
          {
            path: '/addmember',
            element: (
                <AddMember />
            ),
          },
          {
            path: '/users/:memberId',
            element: <UserProfile />,
          },
          {
            path: '/profile/:memberId',
            element: <CurrentUserProfile />,
          },
          {
            path:'/edit-user/:memberId',
            element:<EditUser/>,
          }, 
          {
            path:'/edit-my/:memberId',
            element:<UserProfileEdit/>,
          }, 
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

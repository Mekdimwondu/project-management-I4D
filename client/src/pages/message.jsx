/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {jwtDecode} from 'jwt-decode'; // Correct jwt-decode import
import apiService from '../api/apiService'; // Custom apiService

function Message({ groupId, groupName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(null); // Store the current user's ID
  const [userName, setUserName] = useState({ firstName: '', lastName: '' }); // Store the user's name
  const [socket, setSocket] = useState(null); // Store the socket connection

  // Decode JWT token and set user ID and name
  useEffect(() => {
    const token = localStorage.getItem('User');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id); // Store the current user's ID
        setUserName({
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
        }); // Store the current user's name
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Fetch messages and set up the socket connection
  useEffect(() => {
    if (!groupId) return; // Ensure groupId is present

    // Initialize socket connection once
    const newSocket = io('http://localhost:5000'); // Replace with your socket server URL
    setSocket(newSocket);

    // Join the room
    newSocket.emit('joinRoom', groupId);

    // Fetch messages from the server
    const fetchMessages = async () => {
      try {
        const response = await apiService.get(`/messages/${groupId}`);
        if (Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Handle incoming messages
    const handleNewMessage = (message) => {
      if (message.groupId === groupId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    newSocket.on('receiveMessage', handleNewMessage);

    return () => {
      newSocket.disconnect(); // Clean up socket connection on component unmount
    };
  }, [groupId]);

  // Function to send new messages
  const sendMessage = () => {
    if (!newMessage || !socket) return; // Prevent sending empty messages

    const token = localStorage.getItem('User');
    let decodedToken;
    if (token) {
      try {
        decodedToken = jwtDecode(token); // Decode the token to extract user info
      } catch (error) {
        console.error('Error decoding token:', error);
        return;
      }
    }

    const messageData = {
      content: newMessage,
      groupId,
      sender: {
        _id: decodedToken.id,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
      }, // Pass user's full name along with the ID
      attachments: [], // If any attachments are present, pass them here
    };

    // Send the message to the server via HTTP request
    apiService
      .post(`/messages/${groupId}`, messageData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('User')}`, // Include JWT token in header
        },
      })
      .then((response) => {
        // Do not add the message locally here, wait for the socket event
        setNewMessage(''); // Clear the input field after sending

        // Emit the message through the socket to notify other clients
        socket.emit('sendMessage', {
          ...messageData,
          sender: {
            _id: userId,
            firstName: userName.firstName,
            lastName: userName.lastName,
          }, // Include the user's name when emitting via socket
        });
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Group Name */}
      <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md rounded-md">
        <div className="text-2xl font-semibold">{groupName || 'Select a group'}</div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender?._id === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg shadow-md ${
                  message.sender?._id === userId ? 'bg-blue text-white' : 'bg-gray text-black'
                }`}
              >
                <p className="font-semibold">
                  {message.sender?._id === userId ? 'You' : `${message.sender?.firstName} ${message.sender?.lastName}`}
                </p>
                <p>{message.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-light p-3 rounded-md shadow">No messages yet.</div>
        )}
      </div>

      {/* Message Input Box */}
      <div className="p-4 bg-white shadow-md rounded-md flex items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue2 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Message;

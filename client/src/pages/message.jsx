import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import apiService from "../api/apiService";

function Message({ groupId, groupName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState({ firstName: "", lastName: "" });
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null); // Ref to scroll to the end of the message list

  // Decode JWT token and set user ID and name
  useEffect(() => {
    const token = localStorage.getItem("User");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
        setUserName({
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Fetch messages and set up the socket connection
  useEffect(() => {
    if (!groupId) return;

    // Initialize socket connection once
    const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}`);
    setSocket(newSocket);

    // Join the room
    newSocket.emit("joinRoom", groupId);

    // Fetch messages from the server
    const fetchMessages = async () => {
      try {
        const response = await apiService.get(`/messages/${groupId}`);
        if (Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Handle incoming messages
    const handleNewMessage = (message) => {
      if (message.groupId === groupId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    newSocket.on("receiveMessage", handleNewMessage);

    return () => {
      newSocket.disconnect(); // Clean up socket connection on component unmount
    };
  }, [groupId]);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Function to send new messages
  const sendMessage = () => {
    if (!newMessage || !socket) return;

    const token = localStorage.getItem("User");
    let decodedToken;
    if (token) {
      try {
        decodedToken = jwtDecode(token);
      } catch (error) {
        console.error("Error decoding token:", error);
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
      },
      attachments: [],
    };

    // Send the message to the server via HTTP request
    apiService
      .post(`/messages/${groupId}`, messageData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("User")}`,
        },
      })
      .then(() => {
        setNewMessage(""); // Clear the input field after sending

        // Emit the message through the socket to notify other clients
        socket.emit("sendMessage", {
          ...messageData,
          sender: {
            _id: userId,
            firstName: userName.firstName,
            lastName: userName.lastName,
          },
        });
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Group Name */}
      <div className="flex justify-between items-center p-4 bg-slate-700 shadow-md rounded-md">
        <div className="text-2xl text-white font-semibold">
          {groupName || "Select a group"}
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 flex flex-col overflow-y-auto p-3 gap-y-2 space-y-4 bg-slate-900">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender?._id === userId
                  ? "justify-end items-start "
                  : "justify-start items-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg shadow-md  ${
                  message.sender?._id === userId
                    ? "bg-sky-700 text-white font-thin"
                    : "bg-gray-600 text-white font-thin"
                }`}
              >
                <p className="font-thin">
                  {message.sender?._id === userId
                    ? "You"
                    : `${message.sender?.firstName} ${message.sender?.lastName}`}
                </p>
                <p>{message.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-500 p-3 rounded-md shadow">
            No messages yet.
          </div>
        )}
        {/* Scroll to the bottom marker */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <div className="p-4  bg-slate-700 shadow-md rounded-md flex items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1  bg-slate-700 px-4 py-2 border text-white rounded-md shadow-sm focus:outline-none focus:ring-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Message;

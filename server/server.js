const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongodb = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const userRouter = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const memoRoutes = require('./routes/memoRoutes');
const messageRoutes = require('./routes/messageRoutes'); // Added message routes
const groupRoutes = require('./routes/groupRoutes');

dotenv.config();

const app = express();

// Middleware to enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed methods
  credentials: true, // Allow cookies to be sent
}));

// Middleware to parse JSON requests
app.use(express.json());

// Connect to the database
mongodb();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRouter);
app.use('/api/project', projectRoutes);
app.use('/api', memoRoutes);
app.use('/api', messageRoutes); // Added message routes
app.use('/api/', groupRoutes);

// Create an HTTP server
const server = http.createServer(app);

// Integrate Socket.IO with the server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Listen for incoming connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user joining a project room or individual chat
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle sending a message to a group or individual
  socket.on('sendMessage', (message) => {
    const roomId = message.groupId || message.roomId; // Use either groupId or roomId
    const { content } = message;
  
    if (roomId) {
      io.to(roomId).emit('receiveMessage', message);
      console.log(`Message sent to room ${roomId}:`, content);
    } else {
      console.error('roomId is undefined. Message not sent.');
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = { io }; // Export io if needed elsewhere

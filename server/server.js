const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongodb = require('./config/db');
const http = require('http'); // Add this line
const { Server } = require('socket.io'); // Add this line
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const userRouter = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const memoRoutes = require('./routes/memoRoutes');

dotenv.config();

const app = express();

// Middleware to enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true, // Allow cookies to be sent
}));

// Middleware to parse JSON requests
app.use(express.json());

// Connect to the database
mongodb();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/users',userRouter)
app.use('/api/project',projectRoutes)
app.use('/api', memoRoutes);

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

  // Handle user joining a project room
  socket.on('joinProject', (projectId) => {
    socket.join(projectId);
    console.log(`User ${socket.id} joined project ${projectId}`);
  });

  // Handle sending a message
  socket.on('sendMessage', (message) => {
    const { projectId, content } = message;
    io.to(projectId).emit('receiveMessage', message);
    console.log(`Message sent to project ${projectId}:`, content);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

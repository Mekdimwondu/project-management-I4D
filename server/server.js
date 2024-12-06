// server.js
// server.js

const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongodb = require("./config/db");
const http = require("http");
const path = require("path");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const userRouter = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const memoRoutes = require("./routes/memoRoutes");
const messageRoutes = require("./routes/messageRoutes"); // Added message routes
const groupRoutes = require("./routes/groupRoutes");
const initializeSocket = require("./socket"); // Import the initializeSocket function

dotenv.config();

const app = express();

// Middleware to enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed methods
    credentials: true, // Allow cookies to be sent
  })
);

// Middleware to parse JSON requests
app.use(express.json());

// Connect to the database
mongodb();

// Serve static files from the React app

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRouter);
app.use("/api/project", projectRoutes);
app.use("/api", memoRoutes);
app.use("/api", messageRoutes); // Added message routes
app.use("/api/", groupRoutes);

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = server;

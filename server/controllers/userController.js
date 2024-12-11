const mongoose = require("mongoose");
const { sendPasswordChangeNotification } = require("../utils/emailService");
const crypto = require("node:crypto");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      jobType,
      workType,
      experienceLevel,
      role,
      bio,
    } = req.body;

    // Add validation
    if (!firstName || !lastName || !email) {
      return res
        .status(400)
        .json({
          error: "First name, last name, and email are required fields",
        });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password: email, // Consider generating a random password instead
      phoneNumber,
      gender,
      jobType,
      workType,
      experienceLevel,
      role,
      bio,
      mustChangePassword: true,
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: error.message });
  }
};
// Route to check if an email exists
const checkEmailExists = async (req, res) => {
  const { email } = req.query;
  console.log("Received email check request for:", email);

  if (!email || typeof email !== "string") {
    console.log("Invalid email parameter:", email);
    return res.status(400).json({ error: "Valid email parameter is required" });
  }

  try {
    const user = await User.findOne({ email: email.trim() });
    console.log("User found:", !!user);
    return res.json({ exists: !!user });
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send("User Not found");

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return res.status(404).send("User not found");
    res.status(200).send("User deleted");
  } catch (error) {
    res.status(400).send(error);
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).json({ message: "Error fetching user information", error });
  }
};

// Request password reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Generate a password reset token
    const token = crypto.randomBytes(20).toString("hex");
    console.log(token);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    console.log("Generated Token:", token);
    await user.save();

    // Send reset email
    await sendPasswordChangeNotification(user.email, token);

    res.status(200).send("Password reset email sent");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    // Find the user by token and validate token expiry
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token must still be valid
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    // Update the password using the model method (this will trigger the password hash)
    await user.updatePassword(newPassword);

    // Clear the reset token and expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    const authToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET, // Use your JWT secret here
      { expiresIn: "1h" }
    );
    // Save the user
    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createUser,
  checkEmailExists,
  getUser,
  updateUser,
  deleteUser,
  getUserById,
  requestPasswordReset,
  resetPassword,
};

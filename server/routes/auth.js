// routes/auth.js

const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { forgotPassword, verifyCode, resetPassword } = require('../controllers/authController');
const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid credentials');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Password matched',isMatch);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user._id, role: user.role } });
  } catch (error) {
    console.error('Server error', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyCode);
router.post('/reset-password',resetPassword)
module.exports = router;

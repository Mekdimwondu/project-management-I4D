// controllers/AuthController.js
const User = require('../models/user');
const { sendResetCodeEmail } = require('../utils/emailService');
const generateCode = require('../utils/generateCode');
const jwt = require('jsonwebtoken');

// Forgot Password Controller
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        if (!email) {
            console.log('Email is required');
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(404).json({ error: 'Email not found' });
        }

        const resetCode = generateCode();
        user.resetCode = resetCode;
        user.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
        
        await user.save();
        console.log('Reset code generated for user:', email);

        try {
            await sendResetCodeEmail(email, resetCode);
            console.log('Reset code email sent successfully');
            return res.status(200).json({ message: 'Reset code sent to your email' });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return res.status(500).json({ error: 'Failed to send reset code email' });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// controllers/AuthController.js
exports.verifyCode = async (req, res) => {
    const { email, code } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      if (user.resetCode !== code) return res.status(400).json({ error: 'Invalid code' });
      if (Date.now() > user.resetCodeExpires) return res.status(400).json({ error: 'Code expired' });
  
      // Code is correct, allow password reset
      return res.status(200).json({ message: 'Code verified' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  };

// Reset Password Controller
exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Hash the new password
    
    user.password =password 

    // Clear the reset code fields after successful password change
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    
    await user.save();

    res.status(200).json({ message: 'Password successfully reset' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Input validation
    if (!email || !password) {
      console.log('Missing credentials:', { email: !!email, password: !!password });
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


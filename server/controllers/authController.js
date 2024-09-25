// controllers/AuthController.js
const User = require('../models/user');
const { sendResetCodeEmail } = require('../utils/emailService');
const generateCode = require('../utils/generateCode');
// Forgot Password Controller
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: 'Email not found' });
  
      const resetCode = generateCode();
      user.resetCode = resetCode;
      user.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
      await user.save();
  
      // Send the reset code via email using MailService
      await sendResetCodeEmail(email, resetCode);
  
      return res.status(200).json({ message: 'Reset code sent to your email' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Something went wrong' });
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

  
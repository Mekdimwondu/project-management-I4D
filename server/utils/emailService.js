const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendPasswordChangeNotification = async (Email, token) => {
    console.log('Sending email with Token:', token); 
  const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: {
      name: 'I4D',
      address: process.env.EMAIL_USERNAME,
    },
    to: Email,
    subject: 'Password Change Request',
    text: `You have to change your default password. Click the following link to reset your password: ${resetURL}`,
    html: `<p>You have to change your default password. Click the following link to reset your password:</p><a href="${resetURL}">Reset Password</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to',Email,token);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

const sendUserAssignToProject = async (userEmail) => {
  const mailOptions = {
    from: {
      name: 'I4D',
      address: process.env.EMAIL_USERNAME,
    }, 
    to: userEmail,
    subject: 'Project Alert from I4D',
    text: 'You are assigned to a new project. Check if you are a good fit.',
    html: `<p>You are assigned to a new project. Check if you are a good fit for this project.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent to', userEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendPasswordChangeNotification, sendUserAssignToProject };

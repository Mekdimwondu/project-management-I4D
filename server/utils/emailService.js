// utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or use any other email service provider like 'SendGrid', 'Mailgun', etc.
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    logger:true,
    debug:true,
    secureConnection:false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls:{
        rejectUnAuthorized:true,
    }
});

const sendPasswordChangeNotification = async (userEmail) => {
    const mailOptions = {
        from:{
            name:'I4D',
            address: process.env.EMAIL_USERNAME,
        }, 
        to: userEmail,
        subject: "Welcome to I4D - Let's work together for valuable impact.",
        text: 'Your account has been created. Please log in and change your password immediately.',
        html: `<p>Your account has been created. Please log in and change your password immediately.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent to', userEmail);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendPasswordChangeNotification };

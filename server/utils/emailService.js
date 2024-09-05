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

const sendUserAssignToProject= async (userEmail)=>{
    const mailOptions = {
        from:{
            name:'I4D',
            address: process.env.EMAIL_USERNAME,
        }, 
        to: userEmail,
        subject: "Project Alert from I4D - .",
        text: 'Your assign to new project cheack if u are feet from this projec has been created.',
        html: `<p>"You're assigned to a new project. Check if you are a good fit for this project that has been created. If you're not a fit for the project, please contact the admin."</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent to', userEmail);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


module.exports = { sendPasswordChangeNotification ,sendUserAssignToProject};

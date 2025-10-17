const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",  // <-- must include .com
    port: 465,               // or 587 if you prefer STARTTLS
    secure: true,  
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: 'support <no-reply>@chatbook.com',
            to,
            subject,
            html
        });

    } catch (err) {
        console.error('Error sending email:', err);
    }
};

module.exports = sendEmail;
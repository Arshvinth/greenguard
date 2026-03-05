// server/routes/sendEmail.js
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

//http://Localhost:8081/api/send-email
router.post('/send-email', async (req, res) => {
    const { to, subject, message } = req.body;

    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '',       // Replace with your email
                pass: '',        // App password if 2FA is on
            },
        });

        let mailOptions = {
            from: '',
            to: to,
            subject: subject,
            text: message,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

module.exports = router;

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: (process.env.SMTP_PASS || '').replace(/\s/g, ''),
        },
        connectionTimeout: 10000,  // 10s max to connect
        socketTimeout: 10000,      // 10s max to send
        tls: {
            rejectUnauthorized: false,
        },
    });

    const message = {
        from: `EstateX <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    try {
        const info = await transporter.sendMail(message);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (err) {
        console.error('Email send error:', err.message);
        throw err;
    }
};

module.exports = sendEmail;

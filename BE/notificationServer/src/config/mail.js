'use strict';

const nodemailer = require('nodemailer');
const config = require('./env');

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: false, // false = STARTTLS on port 587
  auth: {
    user: config.mail.user,
    pass: config.mail.pass, // Gmail App Password (16 chars, no spaces)
  },
});

// Verify SMTP connection on startup
const verifyMailTransporter = async () => {
  try {
    await transporter.verify();
    console.log('[Mail] ✅ SMTP transporter ready — Gmail connected');
  } catch (err) {
    console.error('[Mail] ❌ SMTP connection failed:', err.message);
    console.error('[Mail] 💡 Make sure MAIL_USER and MAIL_PASS (App Password) are correct in .env');
  }
};

module.exports = { transporter, verifyMailTransporter };

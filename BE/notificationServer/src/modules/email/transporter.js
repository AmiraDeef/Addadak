'use strict';

const { transporter } = require('../../config/mail');
const config = require('../../config/env');

/**
 * Sends an email using the configured Nodemailer transporter
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @returns {Promise<Object>} Delivery result
 */
const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: config.mail.from,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] Sent to ${to} (MessageId: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error(`[Email] Failed to send to ${to}:`, error.message);
    throw error;
  }
};

module.exports = {
  sendMail,
};

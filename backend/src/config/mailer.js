const nodemailer = require("nodemailer");

/**
 * Nodemailer transporter configured from .env
 * Supports Gmail with App Password (SMTP_PASS).
 *
 * To get a Gmail App Password:
 * Google Account → Security → 2-Step Verification → App Passwords
 */
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for port 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout:   10000,
  socketTimeout:     10000,
});

/**
 * Send an email.
 * @param {object} options - { to, subject, html, text }
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from:    process.env.SMTP_FROM || `"App" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent to ${to} — MessageId: ${info.messageId}`);
  return info;
};

/**
 * Verify SMTP connection (call on server start to confirm config).
 */
const verifyMailer = () => {
  return new Promise((resolve, reject) => {
    transporter.verify((error) => {
      if (error) {
        console.warn(`⚠️  SMTP not connected: ${error.message}`);
        reject(error);
      } else {
        console.log("✅ SMTP Connected — ready to send emails");
        resolve(true);
      }
    });
  });
};

module.exports = { transporter, sendEmail, verifyMailer };

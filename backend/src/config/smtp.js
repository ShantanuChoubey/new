const nodemailer = require("nodemailer");

const requiredSmtpVars = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
];

const missingSmtpVars = requiredSmtpVars.filter((key) => !process.env[key]);
const emailServiceStatus = missingSmtpVars.length === 0 ? "configured" : "not_configured";

let transporter = null;

if (emailServiceStatus === "configured") {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
} else {
  console.warn(
    `⚠️ SMTP is not configured. Missing env: ${missingSmtpVars.join(", ")}`
  );
}

const verifySmtp = async () => {
  if (!transporter) {
    return false;
  }

  return new Promise((resolve) => {
    transporter.verify((error) => {
      if (error) {
        console.warn(`⚠️ SMTP verify failed: ${error.message}`);
        resolve(false);
      } else {
        console.log("✅ SMTP is configured and ready to send mail");
        resolve(true);
      }
    });
  });
};

module.exports = { transporter, emailServiceStatus, verifySmtp };

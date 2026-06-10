const { sendEmail } = require("../config/mailer");

/**
 * Send OTP email for registration verification.
 */
const sendRegisterOtpEmail = async (email, name, otp) => {
  await sendEmail({
    to:      email,
    subject: "Verify your email — OTP",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:8px;">
        <h2 style="color:#2563eb;">Email Verification</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Use the OTP below to verify your email address:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#1e293b;text-align:center;padding:16px;background:#f1f5f9;border-radius:6px;margin:16px 0;">
          ${otp}
        </div>
        <p style="color:#64748b;font-size:13px;">This OTP expires in <strong>${process.env.OTP_EXPIRES_IN_MINUTES || 10} minutes</strong>.</p>
        <p style="color:#64748b;font-size:13px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};

/**
 * Send OTP email for login verification.
 */
const sendLoginOtpEmail = async (email, name, otp) => {
  await sendEmail({
    to:      email,
    subject: "Your login OTP",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:8px;">
        <h2 style="color:#2563eb;">Login Verification</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Use the OTP below to complete your login:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#1e293b;text-align:center;padding:16px;background:#f1f5f9;border-radius:6px;margin:16px 0;">
          ${otp}
        </div>
        <p style="color:#64748b;font-size:13px;">This OTP expires in <strong>${process.env.OTP_EXPIRES_IN_MINUTES || 10} minutes</strong>.</p>
        <p style="color:#64748b;font-size:13px;">If you did not attempt to log in, please secure your account immediately.</p>
      </div>
    `,
  });
};

module.exports = { sendRegisterOtpEmail, sendLoginOtpEmail };

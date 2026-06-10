const bcrypt = require("bcryptjs");

/**
 * Generate a 6-digit numeric OTP.
 * @returns {string} plain 6-digit OTP (e.g. "482910")
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash an OTP for secure storage using bcrypt.
 * @param {string} otp - plain OTP
 * @returns {Promise<string>} bcrypt hash
 */
const hashOtp = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

/**
 * Compare a plain OTP with its stored hash.
 * @param {string} otp       - plain OTP entered by user
 * @param {string} hashedOtp - stored bcrypt hash
 * @returns {Promise<boolean>}
 */
const compareOtp = async (otp, hashedOtp) => {
  return bcrypt.compare(otp, hashedOtp);
};

module.exports = { generateOtp, hashOtp, compareOtp };

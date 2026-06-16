const User          = require("../models/User");
const generateToken = require("../utils/generateToken");
const { generateOtp, hashOtp, compareOtp } = require("../utils/generateOtp");
const { sendRegisterOtpEmail, sendLoginOtpEmail } = require("../utils/sendEmail");
const { sendSuccess, sendError } = require("../utils/response");

// ── Helpers ────────────────────────────────────────────────────
const OTP_EXPIRY_MS = () =>
  (Number(process.env.OTP_EXPIRES_IN_MINUTES) || 10) * 60 * 1000;

// ──────────────────────────────────────────────────────────────
// @desc   Register a new user & send OTP
// @route  POST /api/auth/register
// @access Public
// ──────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return sendError(res, "Name, email and password are required", 400);
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing && existing.isEmailVerified) {
      return sendError(res, "An account with this email already exists", 409);
    }

    // Generate OTP
    const otp       = generateOtp();
    const hashedOtp = await hashOtp(otp);
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MS());

    if (existing && !existing.isEmailVerified) {
      // User registered before but never verified — resend OTP
      existing.name        = name;
      existing.password    = password; // will be hashed by pre-save hook
      existing.otp         = hashedOtp;
      existing.otpExpiresAt = otpExpiresAt;

      try {
        await sendRegisterOtpEmail(email, name, otp);
        await existing.save();
      } catch (error) {
        if (error.statusCode === 503) {
          return sendError(res, "Email service is not configured. OTP cannot be sent.", 503);
        }
        throw error;
      }
    } else {
      try {
        await sendRegisterOtpEmail(email, name, otp);
        await User.create({
          name,
          email,
          password,
          isEmailVerified: false,
          otp:             hashedOtp,
          otpExpiresAt,
        });
      } catch (error) {
        if (error.statusCode === 503) {
          return sendError(res, "Email service is not configured. OTP cannot be sent.", 503);
        }
        throw error;
      }
    }

    sendSuccess(
      res,
      { email },
      `OTP sent to ${email}. Please verify your email to complete registration.`,
      201
    );
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────
// @desc   Verify register OTP → activate account & return JWT
// @route  POST /api/auth/verify-register-otp
// @access Public
// ──────────────────────────────────────────────────────────────
const verifyRegisterOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return sendError(res, "Email and OTP are required", 400);
    }

    // Fetch user WITH otp fields
    const user = await User.findOne({ email: email.toLowerCase() })
      .select("+otp +otpExpiresAt +password");

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    if (!user.otp || !user.otpExpiresAt) {
      return sendError(res, "No OTP found. Please register again.", 400);
    }

    // Check OTP expiry
    if (user.otpExpiresAt < new Date()) {
      return sendError(res, "OTP has expired. Please register again to get a new OTP.", 400);
    }

    // Compare OTP
    const isMatch = await compareOtp(otp, user.otp);
    if (!isMatch) {
      return sendError(res, "Invalid OTP. Please try again.", 400);
    }

    // Mark verified & clear OTP
    user.isEmailVerified = true;
    user.otp             = undefined;
    user.otpExpiresAt    = undefined;
    await user.save();

    // Generate JWT
    const token = generateToken(user._id);

    sendSuccess(
      res,
      {
        token,
        user: {
          id:    user._id,
          name:  user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
        },
      },
      "Email verified successfully. Welcome!",
      200
    );
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────
// @desc   Login — validate credentials & send OTP (NO JWT yet)
// @route  POST /api/auth/login
// @access Public
// ──────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Email and password are required", 400);
    }

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return sendError(res, "Invalid email or password", 401);
    }

    if (!user.isEmailVerified) {
      return sendError(res, "Please verify your email before logging in.", 403);
    }

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, "Invalid email or password", 401);
    }

    // Generate OTP
    const otp          = generateOtp();
    const hashedOtp    = await hashOtp(otp);
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MS());

    user.otp          = hashedOtp;
    user.otpExpiresAt = otpExpiresAt;

    try {
      await sendLoginOtpEmail(email, user.name, otp);
      await user.save();
    } catch (error) {
      if (error.statusCode === 503) {
        return sendError(res, "Email service is not configured. OTP cannot be sent.", 503);
      }
      throw error;
    }

    sendSuccess(
      res,
      { email },
      `Login OTP sent to ${email}. Please verify to complete login.`,
      200
    );
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────
// @desc   Verify login OTP → return JWT
// @route  POST /api/auth/verify-login-otp
// @access Public
// ──────────────────────────────────────────────────────────────
const verifyLoginOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return sendError(res, "Email and OTP are required", 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .select("+otp +otpExpiresAt");

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    if (!user.otp || !user.otpExpiresAt) {
      return sendError(res, "No OTP found. Please login again.", 400);
    }

    // Check OTP expiry
    if (user.otpExpiresAt < new Date()) {
      return sendError(res, "OTP has expired. Please login again.", 400);
    }

    // Compare OTP
    const isMatch = await compareOtp(otp, user.otp);
    if (!isMatch) {
      return sendError(res, "Invalid OTP. Please try again.", 400);
    }

    // Clear OTP fields
    user.otp          = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    // Generate JWT
    const token = generateToken(user._id);

    sendSuccess(
      res,
      {
        token,
        user: {
          id:    user._id,
          name:  user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
        },
      },
      `Welcome back, ${user.name}!`,
      200
    );
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────
// @desc   Get logged-in user profile
// @route  GET /api/auth/profile
// @access Private (requires JWT)
// ──────────────────────────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    // req.user is attached by protect middleware
    sendSuccess(
      res,
      {
        user: {
          id:              req.user._id,
          name:            req.user.name,
          email:           req.user.email,
          isEmailVerified: req.user.isEmailVerified,
          createdAt:       req.user.createdAt,
        },
      },
      "Profile fetched successfully",
      200
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { register, verifyRegisterOtp, login, verifyLoginOtp, getProfile };

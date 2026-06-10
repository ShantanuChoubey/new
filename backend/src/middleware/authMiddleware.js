const jwt  = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/response");

/**
 * protect middleware — verifies JWT and attaches user to req.user
 * Usage: router.get("/profile", protect, profileController)
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "Not authorised — no token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user (exclude password/otp fields)
    const user = await User.findById(decoded.id).select("-password -otp -otpExpiresAt");

    if (!user) {
      return sendError(res, "Not authorised — user not found", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return sendError(res, "Not authorised — invalid token", 401);
    }
    if (error.name === "TokenExpiredError") {
      return sendError(res, "Not authorised — token expired", 401);
    }
    next(error);
  }
};

module.exports = { protect };

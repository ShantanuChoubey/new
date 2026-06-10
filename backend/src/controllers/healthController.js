const mongoose = require("mongoose");
const { cloudinary } = require("../config/cloudinary");
const { sendSuccess } = require("../utils/response");

/**
 * GET /api/health
 * Basic health check — confirms server is running.
 */
const healthCheck = (req, res) => {
  sendSuccess(res, {
    server:    "running",
    timestamp: new Date().toISOString(),
    uptime:    `${Math.floor(process.uptime())}s`,
  }, "Server is healthy");
};

/**
 * GET /api/health/db
 * Confirms MongoDB connection status.
 */
const dbCheck = (req, res) => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const state = mongoose.connection.readyState;

  sendSuccess(res, {
    mongodb: states[state] || "unknown",
    host:    mongoose.connection.host  || "—",
    dbName:  mongoose.connection.name  || "—",
  }, "Database status");
};

/**
 * GET /api/health/cloudinary
 * Pings Cloudinary to confirm credentials work.
 */
const cloudinaryCheck = async (req, res, next) => {
  try {
    const result = await cloudinary.api.ping();
    sendSuccess(res, {
      cloudinary: result.status,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    }, "Cloudinary is connected");
  } catch (error) {
    next(error);
  }
};

module.exports = { healthCheck, dbCheck, cloudinaryCheck };

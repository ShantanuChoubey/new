const { sendSuccess } = require("../utils/response");
const { uploadToCloudinary } = require("../config/cloudinary");

/**
 * GET /api/test
 * Simple endpoint to verify frontend ↔ backend connection.
 */
const getTest = (req, res) => {
  sendSuccess(res, {
    message:     "Frontend is successfully connected to Backend!",
    environment: process.env.NODE_ENV,
    timestamp:   new Date().toISOString(),
  }, "Connection test passed");
};

/**
 * POST /api/test/echo
 * Echoes back whatever JSON body the client sends.
 */
const echoTest = (req, res) => {
  sendSuccess(res, {
    received: req.body,
    echo:     "Your data was received by the backend.",
  }, "Echo test passed");
};

/**
 * POST /api/test/upload
 * Accepts a single image file and uploads it to Cloudinary.
 * Use multer middleware on the route.
 */
const uploadTest = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder:        "test-uploads",
      resource_type: "auto",
    });

    sendSuccess(res, {
      url:       result.secure_url,
      public_id: result.public_id,
      format:    result.format,
      bytes:     result.bytes,
    }, "File uploaded to Cloudinary successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { getTest, echoTest, uploadTest };

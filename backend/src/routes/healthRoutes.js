const express = require("express");
const router  = express.Router();

const {
  healthCheck,
  dbCheck,
  cloudinaryCheck,
} = require("../controllers/healthController");

// GET /api/health
router.get("/", healthCheck);

// GET /api/health/db
router.get("/db", dbCheck);

// GET /api/health/cloudinary
router.get("/cloudinary", cloudinaryCheck);

module.exports = router;

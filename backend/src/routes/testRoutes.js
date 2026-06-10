const express = require("express");
const multer  = require("multer");
const router  = express.Router();

const { getTest, echoTest, uploadTest } = require("../controllers/testController");

// multer with memory storage — no files saved to disk
const upload = multer({ storage: multer.memoryStorage() });

// GET  /api/test
router.get("/", getTest);

// POST /api/test/echo
router.post("/echo", echoTest);

// POST /api/test/upload  (form-data, field name: "file")
router.post("/upload", upload.single("file"), uploadTest);

module.exports = router;

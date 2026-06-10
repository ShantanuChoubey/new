const express = require("express");
const cors    = require("cors");
const morgan  = require("morgan");

const healthRoutes  = require("./routes/healthRoutes");
const testRoutes    = require("./routes/testRoutes");
const authRoutes    = require("./routes/authRoutes");
const notFound      = require("./middleware/notFound");
const errorHandler  = require("./middleware/errorHandler");

const app = express();

// ─── CORS ──────────────────────────────────────────────────────
// Allow requests from the frontend dev server
app.use(
  cors({
    origin:      process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods:     ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Body Parsers ──────────────────────────────────────────────
app.use(express.json());                        // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form-urlencoded bodies

// ─── HTTP Request Logger ───────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Routes ────────────────────────────────────────────────────
app.use("/api/health", healthRoutes);
app.use("/api/test",   testRoutes);
app.use("/api/auth",   authRoutes);

// Root route — quick sanity check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend API is running 🚀",
    version: "1.0.0",
  });
});

// ─── Error Handling ────────────────────────────────────────────
app.use(notFound);      // 404 for unknown routes
app.use(errorHandler);  // Global error handler (must be last)

module.exports = app;

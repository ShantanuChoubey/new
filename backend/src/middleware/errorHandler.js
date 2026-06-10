/**
 * Global error handling middleware.
 * Must be registered LAST in app.js (after all routes).
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message    = err.message    || "Internal Server Error";

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error(`[Error] ${statusCode} - ${message}`);
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only expose stack trace in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;

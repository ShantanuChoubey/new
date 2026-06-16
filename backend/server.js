// Load environment variables from the backend folder explicitly.
// Render will run from the backend root, so we ensure dotenv reads the right file.
require("dotenv").config({ path: __dirname + "/.env" });

const path = require("path");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { verifySmtp } = require("./src/config/smtp");

const PORT = process.env.PORT || 5000;

console.log("================ Render startup diagnostics ================");
console.log(`cwd: ${process.cwd()}`);
console.log(`server.js path: ${__dirname}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`MONGO_URI set: ${!!process.env.MONGO_URI}`);
console.log(`PORT set: ${process.env.PORT || "not set"}`);
console.log("==========================================================");

// Connect to MongoDB then start server
const startServer = async () => {
  await connectDB();

  const smtpOk = await verifySmtp();
  console.log(`📧 Email service: ${smtpOk ? "configured" : "not configured or unavailable"}`);

  app.listen(PORT, () => {
    console.log("─────────────────────────────────────────");
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode`);
    console.log(`🌐 Local:   http://localhost:${PORT}`);
    console.log(`📡 API:     http://localhost:${PORT}/api`);
    console.log(`❤️  Health:  http://localhost:${PORT}/api/health`);
    console.log("─────────────────────────────────────────");
  });
};

startServer();

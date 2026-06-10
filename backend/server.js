// Load environment variables first — before anything else
require("dotenv").config();

const app         = require("./src/app");
const connectDB   = require("./src/config/db");
const { verifyMailer } = require("./src/config/mailer");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start server
const startServer = async () => {
  await connectDB();

  // Verify SMTP (non-blocking — server stays up if SMTP fails)
  await verifyMailer().catch(() => {});

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

import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import accountRoutes from "./routes/account.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import rewardsRoutes from "./routes/rewards.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && process.env.NODE_ENV === "production") {
  console.error(
    "❌ MONGODB_URI is not set in environment variables. Please set it in server/.env"
  );
  process.exit(1);
} else if (!MONGODB_URI) {
  console.warn(
    "⚠️  MONGODB_URI not set — running without DB for local development"
  );
}

if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  console.error(
    "❌ JWT_SECRET is not set in environment variables. Please set it in server/.env"
  );
  process.exit(1);
} else if (!process.env.JWT_SECRET) {
  console.warn(
    "⚠️  JWT_SECRET not set — using insecure defaults for local development"
  );
}

// Configure CORS
const corsOptions: any = { credentials: true };
if (process.env.FRONTEND_URL) {
  corsOptions.origin = process.env.FRONTEND_URL;
} else if (process.env.VERCEL_URL) {
  corsOptions.origin = `https://${process.env.VERCEL_URL}`;
} else {
  corsOptions.origin = true;
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (_req, res) => res.status(200).json({ status: "ok" }));

// DB status endpoint — returns mongoose readyState
app.get("/api/db-status", (_req, res) => {
  const state = mongoose.connection.readyState; // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
  return res.status(200).json({ dbState: state });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/admin", adminRoutes);

// Error handling middleware
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }
);

// Connect to MongoDB if provided
if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      console.log("✅ Connected to MongoDB Atlas");

      // Ensure admin exists
      import("./utils/bootstrap.js").then(({ ensureAdminExists }) => {
        ensureAdminExists();
      });

      if (process.env.VERCEL !== "1") {
        app.listen(PORT, () =>
          console.log(`🚀 Server running on http://localhost:${PORT}`)
        );
      } else {
        console.log("🚀 Serverless function ready on Vercel");
      }
    })
    .catch((error) => {
      console.error("❌ MongoDB connection error:", error);
      if (process.env.NODE_ENV === "production") process.exit(1);
    });
} else {
  // No DB: start server for local development so health checks and UI work.
  if (process.env.VERCEL !== "1") {
    app.listen(PORT, () =>
      console.log(`⚠️ Server running without DB on http://localhost:${PORT}`)
    );
  }
}

export default app;

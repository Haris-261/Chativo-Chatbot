import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import { chatRouter } from "./routes/chatRoutes.js";
import { ensureDatabase } from "./config/database.js";

export function createApp(options = {}) {
  const app = express();
  const connectDatabaseOnRequest = options.connectDatabaseOnRequest ?? false;
  const ensureDatabaseConnection = options.ensureDatabaseConnection ?? ensureDatabase;
  const configuredOrigins = new Set(
    (process.env.CLIENT_ORIGIN || "http://localhost:5173")
      .split(",")
      .map(origin => origin.trim())
      .filter(Boolean)
  );
  const isDevelopment = process.env.NODE_ENV !== "production";

  function isLocalDevelopmentOrigin(origin) {
    if (!isDevelopment) return false;
    try {
      const url = new URL(origin);
      return ["http:", "https:"].includes(url.protocol)
        && ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
    } catch {
      return false;
    }
  }

  app.disable("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({
    origin(origin, callback) {
      if (!origin || configuredOrigins.has(origin) || isLocalDevelopmentOrigin(origin)) {
        return callback(null, true);
      }
      const error = new Error("Origin not allowed.");
      error.status = 403;
      return callback(error);
    }
  }));
  app.use(express.json({ limit: "8kb" }));

  app.get("/", (_request, response) => {
    response.json({
      success: true,
      message: "Chativo backend API is running.",
      health: "/api/health"
    });
  });

  app.get("/api/health", async (_request, response) => {
    let connected = mongoose.connection.readyState === 1;

    if (connectDatabaseOnRequest && !connected) {
      try {
        await ensureDatabaseConnection();
        connected = true;
      } catch (error) {
        console.error(`MongoDB health check failed: ${error.message}`);
      }
    }

    response.status(connected ? 200 : 503).json({
      status: connected ? "ok" : "degraded",
      database: connected ? "connected" : "disconnected"
    });
  });

  async function requireDatabase(_request, _response, next) {
    if (!connectDatabaseOnRequest || mongoose.connection.readyState === 1) {
      return next();
    }

    try {
      await ensureDatabaseConnection();
      return next();
    } catch (error) {
      console.error(`MongoDB request connection failed: ${error.message}`);
      const unavailableError = new Error("The Chativo database is unavailable.");
      unavailableError.status = 503;
      return next(unavailableError);
    }
  }

  app.use("/api/chat", requireDatabase, chatRouter);

  app.use((request, response) => {
    response.status(404).json({
      success: false,
      message: `Route not found: ${request.method} ${request.path}`
    });
  });

  app.use((error, _request, response, _next) => {
    console.error(error);
    response.status(error.status || 500).json({
      error: error.status === 403
        ? "This website origin is not allowed to access the API."
        : "The assistant could not process that request."
    });
  });

  return app;
}

// Vercel imports this default app directly and does not run the local
// src/index.js startup path. Connect lazily and cache the connection instead.
const serverlessApp = createApp({ connectDatabaseOnRequest: true });

export default serverlessApp;

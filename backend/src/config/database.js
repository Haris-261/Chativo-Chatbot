import mongoose from "mongoose";

let connectionPromise = null;

export async function connectDatabase(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB_NAME || "chativo_assistant",
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10
  });
  console.log('Connected to MongoDB successfully');
  return mongoose.connection;
}

export async function ensureDatabase(uri = process.env.MONGODB_URI) {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (mongoose.connection.readyState === 2 && connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = connectDatabase(uri).catch(error => {
    connectionPromise = null;
    throw error;
  });

  return connectionPromise;
}

export async function disconnectDatabase() {
  connectionPromise = null;
  await mongoose.disconnect();
}

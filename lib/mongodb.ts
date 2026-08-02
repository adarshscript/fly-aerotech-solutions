import "server-only";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const CONNECTION_OPTIONS = {
  bufferCommands: false,
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 10,
  minPoolSize: 2,
} as const;

type MongoGlobal = typeof globalThis & {
  _mongooseConnection?: Promise<typeof mongoose>;
};

function getCachedConnection(uri: string): Promise<typeof mongoose> {
  const globalWithMongo = globalThis as MongoGlobal;
  if (!globalWithMongo._mongooseConnection) {
    globalWithMongo._mongooseConnection = mongoose.connect(uri, CONNECTION_OPTIONS);
  }
  return globalWithMongo._mongooseConnection;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined. Add it to .env.local");
  }
  const globalWithMongo = globalThis as MongoGlobal;
  try {
    const connection = await getCachedConnection(MONGODB_URI);
    console.log(
      `[mongodb] Connected (readyState=${connection.connection.readyState})`
    );
    return connection;
  } catch (error) {
    globalWithMongo._mongooseConnection = undefined;
    console.error(
      "[mongodb] Connection failed:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

export async function getConnectionState(): Promise<number> {
  return mongoose.connection.readyState;
}

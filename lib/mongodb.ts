import "server-only";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

const CONNECTION_OPTIONS = {
  bufferCommands: false,
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 10,
  minPoolSize: 2,
} as const;

type MongoGlobal = typeof globalThis & {
  _mongooseConnection?: Promise<typeof mongoose>;
};

function getCachedConnection(uri: string, dbName: string): Promise<typeof mongoose> {
  const globalWithMongo = globalThis as MongoGlobal;
  if (!globalWithMongo._mongooseConnection) {
    globalWithMongo._mongooseConnection = mongoose.connect(uri, {
      ...CONNECTION_OPTIONS,
      dbName,
    });
  }
  return globalWithMongo._mongooseConnection;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = MONGODB_URI?.trim();
  if (!uri) {
    throw new Error("MONGODB_URI is not defined. Add it to .env.local");
  }
  const dbName = DB_NAME?.trim() || "fly_aerotech";

  const globalWithMongo = globalThis as MongoGlobal;
  try {
    const connection = await getCachedConnection(uri, dbName);
    console.log(
      `[mongodb] Connected (db=${connection.connection.db?.databaseName ?? dbName}, readyState=${connection.connection.readyState})`
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

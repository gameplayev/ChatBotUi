import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set in the environment variables");
}

interface CachedMongoose {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: CachedMongoose = (globalThis as any).mongoose || { conn: null, promise: null };

export async function connectDB(): Promise<Mongoose> {

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string)  
      .then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  (globalThis as any).mongoose = cached;

  return cached.conn;
}

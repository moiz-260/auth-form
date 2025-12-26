// src/lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI: string = process.env.MONGODB_URI!; // assert non-null

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in Vercel');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend global to preserve cached connection across hot reloads (Next.js serverless)
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Use cached connection if it exists
const cached = global.mongoose || { conn: null, promise: null };
if (!global.mongoose) global.mongoose = cached;

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;

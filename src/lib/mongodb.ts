// src/lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
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
    // TypeScript now knows MONGODB_URI is string because of the check above
    cached.promise = mongoose.connect(MONGODB_URI as string).then((mongoose) => mongoose);
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
```

**Key changes:**
1. Removed the `: string` type annotation and the `!` non-null assertion from line 3
2. Added `as string` type assertion on line 26 where it's actually used
3. This way TypeScript knows that if the code reaches line 26, `MONGODB_URI` must be a string because of the earlier check

**Also, make sure you have `MONGODB_URI` in your Vercel environment variables:**

1. Go to your Vercel project dashboard
2. Click on "Settings"
3. Click on "Environment Variables"
4. Add `MONGODB_URI` with your MongoDB connection string
5. Redeploy

The environment variable should look something like:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

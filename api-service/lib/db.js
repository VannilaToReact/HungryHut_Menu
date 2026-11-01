const mongoose = require('mongoose');

/**
 * Global cached database connection object for Vercel Serverless environment.
 * Reuses existing connection across warm function invocations to prevent exhausting connection limits.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined.');
  }

  if (!cached.promise) {
    const opts = {
      dbName: 'healthcart',
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log(`[Vercel Serverless] Connected to MongoDB Atlas ("${mongooseInstance.connection.name}")`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    console.error('[Vercel Serverless] MongoDB Connection Error:', err.message);
    throw err;
  }

  return cached.conn;
}

module.exports = connectToDatabase;


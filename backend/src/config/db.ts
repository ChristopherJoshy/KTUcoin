import mongoose from 'mongoose';

// this function is used for connecting backend to MongoDB database without process exit on error for more info refer code-wiki.md line 10
export const connectDB = async (): Promise<boolean> => {
  try {
    const raw = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campuspulse';
    let connStr = raw;
    try {
      const parsed = new URL(raw);
      if (!parsed.pathname || parsed.pathname === '/') {
        connStr = raw.replace(/\/$/, '') + '/ktucoins';
      }
    } catch {
      connStr = raw;
    }
    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] MongoDB Connected to ${connStr}`);
    return true;
  } catch (error) {
    console.warn(`[Database] Local MongoDB Warning: Connection timed out or service offline. Operating in fallback active mode.`);
    return false;
  }
};

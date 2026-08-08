import mongoose from 'mongoose';

// this function is used for connecting backend to MongoDB database for more info refer code-wiki.md line 10
export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campuspulse';
    await mongoose.connect(connStr);
    console.log(`[Database] MongoDB Connected to ${connStr}`);
  } catch (error) {
    console.error(`[Database] Connection Error:`, error);
    process.exit(1);
  }
};

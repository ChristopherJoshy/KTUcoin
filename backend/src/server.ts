import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import setupRoutes from './routes/api.js';
import { seedInitialData } from './seed/seedProfiles.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api', setupRoutes());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'CampusPulse API', timestamp: new Date() });
});

// this function is used for initializing database connection, seeding profiles, and starting Express server for more info refer code-wiki.md line 56
export const startServer = async () => {
  await connectDB();
  await seedInitialData();
  
  app.listen(PORT, () => {
    console.log(`[CampusPulse] Express server running at http://localhost:${PORT}`);
  });
};

startServer();

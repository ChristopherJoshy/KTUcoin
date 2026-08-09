import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import setupRoutes from './routes/api';
import { seedInitialData } from './seed/seedProfiles';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for the deployed Vercel frontend and local dev servers
const ALLOWED_ORIGINS = [
  'https://kt-ucoin.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Endpoints
app.use('/api', setupRoutes());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'KTUcoins API', timestamp: new Date() });
});

// this function is used for initializing database connection, seeding profiles, and starting Express server for more info refer code-wiki.md line 56
export const startServer = async () => {
  const server = app.listen(PORT, () => {
    console.log(`[KTUcoins] Express server running at http://127.0.0.1:${PORT}`);
  });

  const isConnected = await connectDB();
  if (isConnected) {
    await seedInitialData();
  }
};

startServer();

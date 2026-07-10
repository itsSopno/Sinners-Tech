import dotenv from 'dotenv';
import connectDB from './Config/database.js';
import app from './index.js';

// Load env vars
dotenv.config();

// Connect DB once (serverless: connection is cached by mongoose)
connectDB().catch((err) => console.error('DB connection error:', err));

// Export the Express app — Vercel uses this as the serverless function handler
export default app;

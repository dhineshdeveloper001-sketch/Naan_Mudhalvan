import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import taskRoutes from './routes/tasks.js';
import logRoutes from './routes/logs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Root route removed to allow React frontend to serve '/' using static routing.

/* ───────────── CORS ───────────── */
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  /\.netlify\.app$/,
  /\.vercel\.app$/,
  /\.onrender\.com$/,
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);

    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );

    cb(allowed ? null : new Error('CORS not allowed'), allowed);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

/* ───────────── HEALTH CHECK ───────────── */
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/* ───────────── ROUTES ───────────── */
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/logs', logRoutes);

/* ───────────── SERVE FRONTEND (STATIC) ───────────── */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React dist folder
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route to serve the React index.html for any unknown non-API route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

/* ───────────── 404 HANDLER (API ONLY) ───────────── */
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found`
  });
});

/* ───────────── ERROR HANDLER ───────────── */
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

/* ───────────── START SERVER ONLY AFTER DB CONNECT ───────────── */
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Startup failed:', err.message);
    process.exit(1);
  }
}

startServer();
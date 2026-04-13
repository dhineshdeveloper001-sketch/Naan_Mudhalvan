import express from 'express';
import Log from '../models/Log.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/logs
router.get('/', authenticate, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 500);
    const logs = await Log.find().sort({ createdAt: -1 }).limit(limit);
    res.json(logs);
  } catch { res.status(500).json({ error: 'Failed to fetch logs' }); }
});

// POST /api/logs — Manual log entry
router.post('/', authenticate, async (req, res) => {
  try {
    const { message, type } = req.body;
    if (!message) return res.status(400).json({ error: 'message is required' });
    const log = await Log.create({ message, type, triggeredBy: req.user.email });
    res.status(201).json(log);
  } catch { res.status(500).json({ error: 'Failed to create log' }); }
});

export default router;

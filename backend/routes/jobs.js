import { Router } from 'express';
import mongoose from 'mongoose';
import Job from '../models/Job.js';
import verifyToken from '../middleware/verifyToken.js';

const router = Router();
router.use(verifyToken);

// GET /api/jobs/stats — must be above /:id to avoid route shadowing
router.get('/stats', async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const groups = await Job.aggregate([
      { $match: { userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const stats = {};
    let totalJobs = 0;
    for (const { _id, count } of groups) {
      stats[_id] = count;
      totalJobs += count;
    }

    const applied = stats.applied || 0;
    const responses =
      (stats.interview || 0) + (stats.offer || 0) + (stats.rejected || 0);
    const responseRate = applied > 0 ? Math.round((responses / applied) * 100) : 0;

    res.json({ ...stats, totalJobs, responseRate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/jobs
router.post('/', async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, userId: req.user.userId });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/jobs/:id
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

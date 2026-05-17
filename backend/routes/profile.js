import { Router } from 'express';
import User from '../models/User.js';
import verifyToken from '../middleware/verifyToken.js';

const router = Router();
router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('profile');
    res.json(user?.profile || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/', async (req, res) => {
  const { name, currentRole, experience, skills, bio } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { profile: { name, currentRole, experience, skills, bio } },
      { new: true }
    ).select('profile');
    res.json(user.profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

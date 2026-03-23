import { Router } from 'express';
import { createMilestones, fundMilestone, releaseMilestone } from '../controllers/escrow';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/create', protect, createMilestones);
router.post('/:milestoneId/fund', protect, fundMilestone);
router.post('/:milestoneId/release', protect, releaseMilestone);

export default router;

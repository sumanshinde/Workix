import { Router } from 'express';
import { getAssignedVariant, trackExperimentConversion, listAllExperiments } from '../controllers/experiments';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Public (to assign variants to users)
router.get('/assign', getAssignedVariant);
router.post('/track', trackExperimentConversion);

// Admin only (to manage/view experiments)
router.get('/all', protect, authorize(['admin']), listAllExperiments);

export default router;

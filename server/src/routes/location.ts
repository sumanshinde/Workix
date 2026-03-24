import { Router } from 'express';
import { saveLocation, getLocation } from '../controllers/location';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/save', protect, saveLocation);
router.get('/', protect, getLocation);

export default router;

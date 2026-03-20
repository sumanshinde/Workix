import { Router } from 'express';
import { createContract, getMyContracts, submitWork, approveWork } from '../controllers/contracts';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/',             protect, createContract);
router.get('/my',            protect, getMyContracts);
router.post('/submit-work', protect, submitWork);
router.post('/approve-work', protect, approveWork);

export default router;

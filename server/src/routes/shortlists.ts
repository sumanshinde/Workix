import { Router } from 'express';
import { createShortlist, getShortlistForClient, approveShortlist } from '../controllers/shortlists';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.post('/create', protect, authorize(['admin']), createShortlist); // Admin only
router.get('/:id', getShortlistForClient); // Public (for Guests/Clients)
router.post('/:id/approve', approveShortlist); // Public (Approval via unique link)

export default router;

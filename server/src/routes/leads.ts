import { Router } from 'express';
import { captureLead, getAllLeads, updateLeadStatus, addLeadNote } from '../controllers/leads';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.post('/', captureLead); // Public capture
router.get('/', protect, authorize(['admin']), getAllLeads); // Admin only CRM
router.patch('/:id/status', protect, authorize(['admin']), updateLeadStatus);
router.post('/:id/notes', protect, authorize(['admin']), addLeadNote);

export default router;

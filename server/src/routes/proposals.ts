import { Router } from 'express';
import { submitProposal, getJobProposals, getMyProposals, updateProposalStatus } from '../controllers/proposals';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/',                           protect, submitProposal);
router.get('/my',                          protect, getMyProposals);
router.get('/job/:jobId',                  protect, getJobProposals);
router.patch('/:id/status',               protect, updateProposalStatus);

export default router;

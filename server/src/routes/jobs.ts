import { Router } from 'express';
import { createJob, getJobs, getJobById, updateJob, deleteJob, getMyJobs } from '../controllers/jobs';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/',           getJobs);
router.get('/my',         protect, getMyJobs);
router.get('/:id',        getJobById);
router.post('/',          protect, createJob);
router.put('/:id',        protect, updateJob);
router.delete('/:id',     protect, deleteJob);

export default router;

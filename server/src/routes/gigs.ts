import { Router } from 'express';
import { createGig, getGigs, getGigById, updateGig, deleteGig, getMyGigs } from '../controllers/gigs';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/',         getGigs);
router.get('/my',       protect, getMyGigs);
router.get('/:id',      getGigById);
router.post('/',        protect, createGig);
router.put('/:id',      protect, updateGig);
router.delete('/:id',   protect, deleteGig);

export default router;

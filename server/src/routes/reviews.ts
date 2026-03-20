import { Router } from 'express';
import { submitReview, getUserReviews } from '../controllers/reviews';

const router = Router();

router.post('/', submitReview);
router.get('/:userId', getUserReviews);

export default router;

import { Router } from 'express';
import {
  createRequirementPost,
  verifyRequirementPayment,
  getRequirementPosts,
  getMyRequirementPosts,
  getRequirementById,
  respondToRequirement,
} from '../controllers/requirementPosts';
import { authenticate } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limit posting to prevent spam (max 10 posts per hour)
const postLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: 'Too many requirement posts. Please try again later.' },
});

router.get('/', getRequirementPosts);                           // Public: browse requirements
router.get('/my', authenticate, getMyRequirementPosts);         // Auth: my posts
router.get('/:id', getRequirementById);                         // Public: single requirement
router.post('/', authenticate, postLimiter, createRequirementPost);  // Auth: create + payment order
router.post('/verify-payment', authenticate, verifyRequirementPayment); // Auth: verify payment
router.post('/respond', authenticate, respondToRequirement);    // Auth: freelancer respond & earn

export default router;

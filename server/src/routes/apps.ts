import { Router } from 'express';
import { getReadyApps, createReadyApp, getAppById } from '../controllers/apps';

const router = Router();

router.get('/', getReadyApps);
router.post('/', createReadyApp);
router.get('/:id', getAppById);

export default router;

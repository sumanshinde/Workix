import { Router } from 'express';
import { getFinancialReport, exportCSV, exportPDF, getAnalyticsSummary, trackAnalyticsEvent } from '../controllers/reports';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/monthly', authenticate, authorize(['admin']), getFinancialReport);
router.get('/export/csv', authenticate, authorize(['admin']), exportCSV);
router.get('/export/pdf', authenticate, authorize(['admin']), exportPDF);
router.get('/analytics', authenticate, authorize(['admin']), getAnalyticsSummary);
router.post('/track', authenticate, trackAnalyticsEvent);

export default router;

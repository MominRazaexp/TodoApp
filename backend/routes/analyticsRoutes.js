import express from 'express';
import { trackEvent, startSession, endSession, getSummary } from '../controllers/analyticsController.js';

const router = express.Router();

router.post('/event', trackEvent);
router.post('/session/start', startSession);
router.post('/session/end', endSession);
router.get('/summary', getSummary);

export default router;
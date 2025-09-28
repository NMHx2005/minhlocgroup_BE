import { Router } from 'express';
import {
    createContactMessage,
    createConsultationRequest,
    subscribeNewsletter,
    unsubscribeNewsletter,
    verifyNewsletterSubscription
} from '../../controllers/client/contactController';

const router = Router();

// Contact routes (no authentication required for public access)
router.post('/messages', createContactMessage);
router.post('/consultation-requests', createConsultationRequest);
router.post('/newsletter-subscribers', subscribeNewsletter);
router.delete('/newsletter-subscribers/:email', unsubscribeNewsletter);
router.get('/newsletter-subscribers/verify/:token', verifyNewsletterSubscription);

export default router;

import { Router } from 'express';
import {
    getContactMessages,
    getContactMessageById,
    createContactMessage,
    updateContactMessage,
    deleteContactMessage,
    updateContactMessageStatus,
    getNewsletterSubscribers,
    createNewsletterSubscriber,
    deleteNewsletterSubscriber,
    getNewsletterCampaigns,
    createNewsletterCampaign,
    sendNewsletterCampaign,
    getConsultationRequests,
    getConsultationRequestById,
    createConsultationRequest,
    updateConsultationRequest,
    assignConsultationRequest,
    updateConsultationRequestStatus
} from '@/controllers/admin/contactController';
import { authMiddleware } from '@/middleware/auth';
import { adminMiddleware } from '@/middleware/admin';

const router = Router();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Contact message routes
router.get('/messages', getContactMessages);
router.get('/messages/:id', getContactMessageById);
router.post('/messages', createContactMessage);
router.put('/messages/:id', updateContactMessage);
router.delete('/messages/:id', deleteContactMessage);
router.put('/messages/:id/status', updateContactMessageStatus);

// Newsletter subscriber routes
router.get('/newsletter-subscribers', getNewsletterSubscribers);
router.post('/newsletter-subscribers', createNewsletterSubscriber);
router.delete('/newsletter-subscribers/:id', deleteNewsletterSubscriber);

// Newsletter campaign routes
router.get('/newsletter-campaigns', getNewsletterCampaigns);
router.post('/newsletter-campaigns', createNewsletterCampaign);
router.post('/newsletter-campaigns/:id/send', sendNewsletterCampaign);

// Consultation request routes
router.get('/consultation-requests', getConsultationRequests);
router.get('/consultation-requests/:id', getConsultationRequestById);
router.post('/consultation-requests', createConsultationRequest);
router.put('/consultation-requests/:id', updateConsultationRequest);
router.put('/consultation-requests/:id/assign', assignConsultationRequest);
router.put('/consultation-requests/:id/status', updateConsultationRequestStatus);

export default router;

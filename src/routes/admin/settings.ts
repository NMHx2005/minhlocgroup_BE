import { Router } from 'express';
import {
    getGeneralSettings,
    updateGeneralSettings,
    uploadLogo,
    uploadFavicon,
    getApiSettings,
    updateApiSettings,
    getApiKeys,
    createApiKey,
    deleteApiKey,
    testApiConnection,
    getEmailSettings,
    updateEmailSettings,
    getEmailTemplates,
    createEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate,
    testEmailSending,
    getSocialSettings,
    updateSocialSettings,
    getSocialLinks,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink
} from '@/controllers/admin/settingsController';
import { authMiddleware } from '@/middleware/auth';
import { adminMiddleware } from '@/middleware/admin';
import { upload } from '@/middleware/upload';

const router = Router();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// General settings routes
router.get('/general', getGeneralSettings);
router.put('/general', updateGeneralSettings);
router.post('/upload-logo', upload.single('logo'), uploadLogo);
router.post('/upload-favicon', upload.single('favicon'), uploadFavicon);

// API settings routes
router.get('/api', getApiSettings);
router.put('/api', updateApiSettings);
router.get('/api-keys', getApiKeys);
router.post('/api-keys', createApiKey);
router.delete('/api-keys/:id', deleteApiKey);
router.post('/api-keys/test', testApiConnection);

// Email settings routes
router.get('/email', getEmailSettings);
router.put('/email', updateEmailSettings);
router.get('/email-templates', getEmailTemplates);
router.post('/email-templates', createEmailTemplate);
router.put('/email-templates/:id', updateEmailTemplate);
router.delete('/email-templates/:id', deleteEmailTemplate);
router.post('/email/test', testEmailSending);

// Social media settings routes
router.get('/social', getSocialSettings);
router.put('/social', updateSocialSettings);
router.get('/social-links', getSocialLinks);
router.post('/social-links', createSocialLink);
router.put('/social-links/:id', updateSocialLink);
router.delete('/social-links/:id', deleteSocialLink);

export default router;

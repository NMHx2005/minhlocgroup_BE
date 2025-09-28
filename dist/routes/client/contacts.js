"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = require("@/controllers/client/contactController");
const router = (0, express_1.Router)();
router.post('/messages', contactController_1.createContactMessage);
router.post('/consultation-requests', contactController_1.createConsultationRequest);
router.post('/newsletter-subscribers', contactController_1.subscribeNewsletter);
router.delete('/newsletter-subscribers/:email', contactController_1.unsubscribeNewsletter);
router.get('/newsletter-subscribers/verify/:token', contactController_1.verifyNewsletterSubscription);
exports.default = router;
//# sourceMappingURL=contacts.js.map
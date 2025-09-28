"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyNewsletterSubscription = exports.unsubscribeNewsletter = exports.subscribeNewsletter = exports.createConsultationRequest = exports.createContactMessage = void 0;
const contactService_1 = require("@/services/client/contactService");
const createContactMessage = async (req, res) => {
    try {
        const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || '127.0.0.1';
        const messageData = {
            ...req.body,
            ipAddress: ipAddress,
            userAgent: req.get('User-Agent') || 'Unknown',
            source: 'website'
        };
        const message = await contactService_1.contactService.createContactMessage(messageData);
        res.status(201).json({
            success: true,
            message: 'Gửi tin nhắn thành công. Chúng tôi sẽ liên hệ lại sớm nhất!',
            data: message
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi gửi tin nhắn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createContactMessage = createContactMessage;
const createConsultationRequest = async (req, res) => {
    try {
        const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || '127.0.0.1';
        const requestData = {
            ...req.body,
            ipAddress: ipAddress,
            userAgent: req.get('User-Agent') || 'Unknown',
            source: 'website'
        };
        const request = await contactService_1.contactService.createConsultationRequest(requestData);
        res.status(201).json({
            success: true,
            message: 'Gửi yêu cầu tư vấn thành công. Chúng tôi sẽ liên hệ lại sớm nhất!',
            data: request
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi gửi yêu cầu tư vấn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createConsultationRequest = createConsultationRequest;
const subscribeNewsletter = async (req, res) => {
    try {
        const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || '127.0.0.1';
        const subscriberData = {
            ...req.body,
            ipAddress: ipAddress,
            userAgent: req.get('User-Agent') || 'Unknown',
            source: 'website'
        };
        const subscriber = await contactService_1.contactService.subscribeNewsletter(subscriberData);
        res.status(201).json({
            success: true,
            message: 'Đăng ký nhận tin thành công!',
            data: subscriber
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi đăng ký nhận tin',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.subscribeNewsletter = subscribeNewsletter;
const unsubscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.params;
        const unsubscribed = await contactService_1.contactService.unsubscribeNewsletter(email);
        if (!unsubscribed) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy đăng ký nhận tin'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Hủy đăng ký nhận tin thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi hủy đăng ký nhận tin',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.unsubscribeNewsletter = unsubscribeNewsletter;
const verifyNewsletterSubscription = async (req, res) => {
    try {
        const { token } = req.params;
        const verified = await contactService_1.contactService.verifyNewsletterSubscription(token);
        if (!verified) {
            res.status(400).json({
                success: false,
                message: 'Token xác thực không hợp lệ hoặc đã hết hạn'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Xác thực đăng ký nhận tin thành công!'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xác thực đăng ký nhận tin',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.verifyNewsletterSubscription = verifyNewsletterSubscription;
//# sourceMappingURL=contactController.js.map
import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { contactService } from '@/services/client/contactService';

/**
 * Create contact message
 * POST /api/v1/client/contact-messages
 */
export const createContactMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Get IP address with fallback for localhost
        const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || '127.0.0.1';

        const messageData = {
            ...req.body,
            ipAddress: ipAddress,
            userAgent: req.get('User-Agent') || 'Unknown',
            source: 'website'
        };

        const message = await contactService.createContactMessage(messageData);
        res.status(201).json({
            success: true,
            message: 'Gửi tin nhắn thành công. Chúng tôi sẽ liên hệ lại sớm nhất!',
            data: message
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi gửi tin nhắn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Create consultation request
 * POST /api/v1/client/consultation-requests
 */
export const createConsultationRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Get IP address with fallback for localhost
        const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || '127.0.0.1';

        const requestData = {
            ...req.body,
            ipAddress: ipAddress,
            userAgent: req.get('User-Agent') || 'Unknown',
            source: 'website'
        };

        const request = await contactService.createConsultationRequest(requestData);
        res.status(201).json({
            success: true,
            message: 'Gửi yêu cầu tư vấn thành công. Chúng tôi sẽ liên hệ lại sớm nhất!',
            data: request
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi gửi yêu cầu tư vấn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Subscribe to newsletter
 * POST /api/v1/client/newsletter-subscribers
 */
export const subscribeNewsletter = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get IP address with fallback for localhost
        const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || '127.0.0.1';

        const subscriberData = {
            ...req.body,
            ipAddress: ipAddress,
            userAgent: req.get('User-Agent') || 'Unknown',
            source: 'website'
        };

        const subscriber = await contactService.subscribeNewsletter(subscriberData);
        res.status(201).json({
            success: true,
            message: 'Đăng ký nhận tin thành công!',
            data: subscriber
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi đăng ký nhận tin',
            error: error instanceof Error ? error.message : 'Unknown error'
        });

        return;
    }
};

/**
 * Unsubscribe from newsletter
 * DELETE /api/v1/client/newsletter-subscribers/:email
 */
export const unsubscribeNewsletter = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.params;
        const unsubscribed = await contactService.unsubscribeNewsletter(email as string);

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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi hủy đăng ký nhận tin',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Verify newsletter subscription
 * GET /api/v1/client/newsletter-subscribers/verify/:token
 */
export const verifyNewsletterSubscription = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.params;
        const verified = await contactService.verifyNewsletterSubscription(token as string);

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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xác thực đăng ký nhận tin',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

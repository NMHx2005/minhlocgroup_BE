import { Request, Response } from 'express';
import { contactService } from '../../services/admin/contactService';
import { AuthRequest } from '../../middleware/auth';

/**
 * Get all contact messages with pagination and filters
 * GET /api/v1/admin/contacts/messages
 */
export const getContactMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, search, status, priority, assignedTo } = req.query;

        const filters = {
            search: search as string,
            status: status as string,
            priority: priority as string,
            assignedTo: assignedTo as string
        };

        const result = await contactService.getContactMessages(
            parseInt(page as string),
            parseInt(limit as string),
            filters
        );

        res.json({
            success: true,
            data: result.messages,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách tin nhắn liên hệ',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get contact message by ID
 * GET /api/v1/admin/contacts/messages/:id
 */
export const getContactMessageById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const message = await contactService.getContactMessageById(id as string);

        if (!message) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy tin nhắn'
            });
            return;
        }

        res.json({
            success: true,
            data: message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin tin nhắn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Create new contact message
 * POST /api/v1/admin/contacts/messages
 */
export const createContactMessage = async (req: AuthRequest, res: Response) => {
    try {
        const messageData = {
            ...req.body,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        };

        const message = await contactService.createContactMessage(messageData as any);
        res.status(201).json({
            success: true,
            message: 'Gửi tin nhắn thành công',
            data: message
        });
        return;
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi gửi tin nhắn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Update contact message
 * PUT /api/v1/admin/contacts/messages/:id
 */
export const updateContactMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updatedBy: req.user?.id as string
        };

        const message = await contactService.updateContactMessage(id as string, updateData);

        if (!message) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy tin nhắn'
            });
            return;
        }

        res.json({
            success: true,
            message: 'Cập nhật tin nhắn thành công',
            data: message
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật tin nhắn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Delete contact message
 * DELETE /api/v1/admin/contacts/messages/:id
 */
export const deleteContactMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await contactService.deleteContactMessage(id as string);

        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy tin nhắn'
            });
            return;
        }

        res.json({
            success: true,
            message: 'Xóa tin nhắn thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa tin nhắn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Update contact message status
 * PUT /api/v1/admin/contacts/messages/:id/status
 */
export const updateContactMessageStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const message = await contactService.updateContactMessageStatus(id as string, status);

        if (!message) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy tin nhắn'
            });
            return;
        }

        res.json({
            success: true,
            message: 'Cập nhật trạng thái thành công',
            data: message
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get newsletter subscribers
 * GET /api/v1/admin/contacts/newsletter-subscribers
 */
export const getNewsletterSubscribers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, search, status, source } = req.query;

        const filters = {
            search: search as string,
            status: status as string,
            source: source as string
        };

        const result = await contactService.getNewsletterSubscribers(
            parseInt(page as string),
            parseInt(limit as string),
            filters
        );

        res.json({
            success: true,
            data: result.subscribers,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách đăng ký nhận tin',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Create newsletter subscriber
 * POST /api/v1/admin/contacts/newsletter-subscribers
 */
export const createNewsletterSubscriber = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const subscriberData = {
            ...req.body,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        };

        const subscriber = await contactService.createNewsletterSubscriber(subscriberData as any);
        res.status(201).json({
            success: true,
            message: 'Đăng ký nhận tin thành công',
            data: subscriber
        });
        return;
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
 * Delete newsletter subscriber
 * DELETE /api/v1/admin/contacts/newsletter-subscribers/:id
 */
export const deleteNewsletterSubscriber = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await contactService.deleteNewsletterSubscriber(id as string);

        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy đăng ký nhận tin'
            });
            return;
        }

        res.json({
            success: true,
            message: 'Hủy đăng ký thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi hủy đăng ký',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get newsletter campaigns
 * GET /api/v1/admin/contacts/newsletter-campaigns
 */
export const getNewsletterCampaigns = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, search, status } = req.query;

        const filters = {
            search: search as string,
            status: status as string
        };

        const result = await contactService.getNewsletterCampaigns(
            parseInt(page as string),
            parseInt(limit as string),
            filters
        );

        res.json({
            success: true,
            data: result.campaigns,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách chiến dịch email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Create newsletter campaign
 * POST /api/v1/admin/contacts/newsletter-campaigns
 */
export const createNewsletterCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const campaignData = {
            ...req.body,
            createdBy: req.user?.id as string
        };

        const campaign = await contactService.createNewsletterCampaign(campaignData as any);
        res.status(201).json({
            success: true,
            message: 'Tạo chiến dịch email thành công',
            data: campaign
        });
        return;
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo chiến dịch email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Send newsletter campaign
 * POST /api/v1/admin/contacts/newsletter-campaigns/:id/send
 */
export const sendNewsletterCampaign = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const campaign = await contactService.sendNewsletterCampaign(id as string);

        if (!campaign) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy chiến dịch email'
            });
            return;
        }

        res.json({
            success: true,
            message: 'Gửi chiến dịch email thành công',
            data: campaign
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi gửi chiến dịch email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get consultation requests
 * GET /api/v1/admin/contacts/consultation-requests
 */
export const getConsultationRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, search, status, priority, serviceType } = req.query;

        const filters = {
            search: search as string,
            status: status as string,
            priority: priority as string,
            serviceType: serviceType as string
        };

        const result = await contactService.getConsultationRequests(
            parseInt(page as string),
            parseInt(limit as string),
            filters
        );

        res.json({
            success: true,
            data: result.requests,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách yêu cầu tư vấn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get consultation request by ID
 * GET /api/v1/admin/contacts/consultation-requests/:id
 */
export const getConsultationRequestById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const request = await contactService.getConsultationRequestById(id as string);

        if (!request) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy yêu cầu tư vấn'
            });
            return;
        }

        res.json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin yêu cầu tư vấn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Create consultation request
 * POST /api/v1/admin/contacts/consultation-requests
 */
export const createConsultationRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const requestData = {
            ...req.body,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        };

        const request = await contactService.createConsultationRequest(requestData as any);
        res.status(201).json({
            success: true,
            message: 'Gửi yêu cầu tư vấn thành công',
            data: request
        });
        return;
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi gửi yêu cầu tư vấn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Update consultation request
 * PUT /api/v1/admin/contacts/consultation-requests/:id
 */
export const updateConsultationRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updatedBy: req.user?.id as string
        };

        const request = await contactService.updateConsultationRequest(id as string, updateData);

        if (!request) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy yêu cầu tư vấn'
            });
            return;
        }

        res.json({
            success: true,
            message: 'Cập nhật yêu cầu tư vấn thành công',
            data: request
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật yêu cầu tư vấn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Assign consultation request
 * PUT /api/v1/admin/contacts/consultation-requests/:id/assign
 */
export const assignConsultationRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { assignedTo } = req.body;

        const request = await contactService.assignConsultationRequest(id as string, assignedTo);

        if (!request) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy yêu cầu tư vấn'
            });
            return;
        }

        res.json({
            success: true,
            message: 'Phân công yêu cầu tư vấn thành công',
            data: request
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi phân công yêu cầu tư vấn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Update consultation request status
 * PUT /api/v1/admin/contacts/consultation-requests/:id/status
 */
export const updateConsultationRequestStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const request = await contactService.updateConsultationRequestStatus(id as string, status);

        if (!request) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy yêu cầu tư vấn'
            });
            return;
        }

        res.json({
            success: true,
            message: 'Cập nhật trạng thái yêu cầu tư vấn thành công',
            data: request
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái yêu cầu tư vấn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
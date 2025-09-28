"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConsultationRequestStatus = exports.assignConsultationRequest = exports.updateConsultationRequest = exports.createConsultationRequest = exports.getConsultationRequestById = exports.getConsultationRequests = exports.sendNewsletterCampaign = exports.createNewsletterCampaign = exports.getNewsletterCampaigns = exports.deleteNewsletterSubscriber = exports.createNewsletterSubscriber = exports.getNewsletterSubscribers = exports.updateContactMessageStatus = exports.deleteContactMessage = exports.updateContactMessage = exports.createContactMessage = exports.getContactMessageById = exports.getContactMessages = void 0;
const contactService_1 = require("@/services/admin/contactService");
const getContactMessages = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status, priority, assignedTo } = req.query;
        const filters = {
            search: search,
            status: status,
            priority: priority,
            assignedTo: assignedTo
        };
        const result = await contactService_1.contactService.getContactMessages(parseInt(page), parseInt(limit), filters);
        res.json({
            success: true,
            data: result.messages,
            pagination: result.pagination
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách tin nhắn liên hệ',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getContactMessages = getContactMessages;
const getContactMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await contactService_1.contactService.getContactMessageById(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin tin nhắn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getContactMessageById = getContactMessageById;
const createContactMessage = async (req, res) => {
    try {
        const messageData = {
            ...req.body,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        };
        const message = await contactService_1.contactService.createContactMessage(messageData);
        res.status(201).json({
            success: true,
            message: 'Gửi tin nhắn thành công',
            data: message
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi gửi tin nhắn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.createContactMessage = createContactMessage;
const updateContactMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updatedBy: req.user?.id
        };
        const message = await contactService_1.contactService.updateContactMessage(id, updateData);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật tin nhắn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateContactMessage = updateContactMessage;
const deleteContactMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await contactService_1.contactService.deleteContactMessage(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa tin nhắn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.deleteContactMessage = deleteContactMessage;
const updateContactMessageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const message = await contactService_1.contactService.updateContactMessageStatus(id, status);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateContactMessageStatus = updateContactMessageStatus;
const getNewsletterSubscribers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status, source } = req.query;
        const filters = {
            search: search,
            status: status,
            source: source
        };
        const result = await contactService_1.contactService.getNewsletterSubscribers(parseInt(page), parseInt(limit), filters);
        res.json({
            success: true,
            data: result.subscribers,
            pagination: result.pagination
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách đăng ký nhận tin',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getNewsletterSubscribers = getNewsletterSubscribers;
const createNewsletterSubscriber = async (req, res) => {
    try {
        const subscriberData = {
            ...req.body,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        };
        const subscriber = await contactService_1.contactService.createNewsletterSubscriber(subscriberData);
        res.status(201).json({
            success: true,
            message: 'Đăng ký nhận tin thành công',
            data: subscriber
        });
        return;
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
exports.createNewsletterSubscriber = createNewsletterSubscriber;
const deleteNewsletterSubscriber = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await contactService_1.contactService.deleteNewsletterSubscriber(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi hủy đăng ký',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.deleteNewsletterSubscriber = deleteNewsletterSubscriber;
const getNewsletterCampaigns = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status } = req.query;
        const filters = {
            search: search,
            status: status
        };
        const result = await contactService_1.contactService.getNewsletterCampaigns(parseInt(page), parseInt(limit), filters);
        res.json({
            success: true,
            data: result.campaigns,
            pagination: result.pagination
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách chiến dịch email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getNewsletterCampaigns = getNewsletterCampaigns;
const createNewsletterCampaign = async (req, res) => {
    try {
        const campaignData = {
            ...req.body,
            createdBy: req.user?.id
        };
        const campaign = await contactService_1.contactService.createNewsletterCampaign(campaignData);
        res.status(201).json({
            success: true,
            message: 'Tạo chiến dịch email thành công',
            data: campaign
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo chiến dịch email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.createNewsletterCampaign = createNewsletterCampaign;
const sendNewsletterCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await contactService_1.contactService.sendNewsletterCampaign(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi gửi chiến dịch email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.sendNewsletterCampaign = sendNewsletterCampaign;
const getConsultationRequests = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status, priority, serviceType } = req.query;
        const filters = {
            search: search,
            status: status,
            priority: priority,
            serviceType: serviceType
        };
        const result = await contactService_1.contactService.getConsultationRequests(parseInt(page), parseInt(limit), filters);
        res.json({
            success: true,
            data: result.requests,
            pagination: result.pagination
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách yêu cầu tư vấn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getConsultationRequests = getConsultationRequests;
const getConsultationRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await contactService_1.contactService.getConsultationRequestById(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin yêu cầu tư vấn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getConsultationRequestById = getConsultationRequestById;
const createConsultationRequest = async (req, res) => {
    try {
        const requestData = {
            ...req.body,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        };
        const request = await contactService_1.contactService.createConsultationRequest(requestData);
        res.status(201).json({
            success: true,
            message: 'Gửi yêu cầu tư vấn thành công',
            data: request
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi gửi yêu cầu tư vấn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.createConsultationRequest = createConsultationRequest;
const updateConsultationRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updatedBy: req.user?.id
        };
        const request = await contactService_1.contactService.updateConsultationRequest(id, updateData);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật yêu cầu tư vấn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateConsultationRequest = updateConsultationRequest;
const assignConsultationRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedTo } = req.body;
        const request = await contactService_1.contactService.assignConsultationRequest(id, assignedTo);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi phân công yêu cầu tư vấn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.assignConsultationRequest = assignConsultationRequest;
const updateConsultationRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const request = await contactService_1.contactService.updateConsultationRequestStatus(id, status);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái yêu cầu tư vấn',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateConsultationRequestStatus = updateConsultationRequestStatus;
//# sourceMappingURL=contactController.js.map
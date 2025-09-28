"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactService = void 0;
const core_1 = require("@/models/core");
class ContactService {
    async getContactMessages(page, limit, filters) {
        try {
            const query = {};
            if (filters.search) {
                query.$or = [
                    { name: { $regex: filters.search, $options: 'i' } },
                    { email: { $regex: filters.search, $options: 'i' } },
                    { subject: { $regex: filters.search, $options: 'i' } },
                    { message: { $regex: filters.search, $options: 'i' } }
                ];
            }
            if (filters.status) {
                query.status = filters.status;
            }
            if (filters.priority) {
                query.priority = filters.priority;
            }
            if (filters.assignedTo) {
                query.assignedTo = filters.assignedTo;
            }
            const skip = (page - 1) * limit;
            const total = await core_1.ContactMessage.countDocuments(query);
            const messages = await core_1.ContactMessage.find(query)
                .populate('assignedTo', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
            return {
                messages,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách tin nhắn liên hệ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getContactMessageById(id) {
        try {
            const message = await core_1.ContactMessage.findById(id)
                .populate('assignedTo', 'name email')
                .lean();
            return message;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin tin nhắn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createContactMessage(messageData) {
        try {
            const message = new core_1.ContactMessage(messageData);
            await message.save();
            return await core_1.ContactMessage.findById(message._id)
                .populate('assignedTo', 'name email')
                .lean();
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo tin nhắn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateContactMessage(id, updateData) {
        try {
            const message = await core_1.ContactMessage.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true })
                .populate('assignedTo', 'name email')
                .lean();
            return message;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật tin nhắn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteContactMessage(id) {
        try {
            const result = await core_1.ContactMessage.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa tin nhắn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateContactMessageStatus(id, status) {
        try {
            const message = await core_1.ContactMessage.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true, runValidators: true })
                .populate('assignedTo', 'name email')
                .lean();
            return message;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật trạng thái tin nhắn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getNewsletterSubscribers(page, limit, filters) {
        try {
            const query = {};
            if (filters.search) {
                query.$or = [
                    { email: { $regex: filters.search, $options: 'i' } },
                    { name: { $regex: filters.search, $options: 'i' } }
                ];
            }
            if (filters.status) {
                query.status = filters.status;
            }
            if (filters.source) {
                query.source = filters.source;
            }
            const skip = (page - 1) * limit;
            const total = await core_1.NewsletterSubscriber.countDocuments(query);
            const subscribers = await core_1.NewsletterSubscriber.find(query)
                .sort({ subscribedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
            return {
                subscribers,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách đăng ký nhận tin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createNewsletterSubscriber(subscriberData) {
        try {
            const subscriber = new core_1.NewsletterSubscriber(subscriberData);
            await subscriber.save();
            return subscriber;
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo đăng ký nhận tin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteNewsletterSubscriber(id) {
        try {
            const result = await core_1.NewsletterSubscriber.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa đăng ký nhận tin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getNewsletterCampaigns(page, limit, filters) {
        try {
            const query = {};
            if (filters.search) {
                query.$or = [
                    { name: { $regex: filters.search, $options: 'i' } },
                    { subject: { $regex: filters.search, $options: 'i' } }
                ];
            }
            if (filters.status) {
                query.status = filters.status;
            }
            const skip = (page - 1) * limit;
            const total = await core_1.NewsletterCampaign.countDocuments(query);
            const campaigns = await core_1.NewsletterCampaign.find(query)
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
            return {
                campaigns,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách chiến dịch email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createNewsletterCampaign(campaignData) {
        try {
            const campaign = new core_1.NewsletterCampaign(campaignData);
            await campaign.save();
            return await core_1.NewsletterCampaign.findById(campaign._id)
                .populate('createdBy', 'name email')
                .lean();
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo chiến dịch email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async sendNewsletterCampaign(id) {
        try {
            const campaign = await core_1.NewsletterCampaign.findByIdAndUpdate(id, {
                status: 'sending',
                sentAt: new Date(),
                updatedAt: new Date()
            }, { new: true, runValidators: true })
                .populate('createdBy', 'name email')
                .lean();
            return campaign;
        }
        catch (error) {
            throw new Error(`Lỗi khi gửi chiến dịch email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getConsultationRequests(page, limit, filters) {
        try {
            const query = {};
            if (filters.search) {
                query.$or = [
                    { name: { $regex: filters.search, $options: 'i' } },
                    { email: { $regex: filters.search, $options: 'i' } },
                    { message: { $regex: filters.search, $options: 'i' } }
                ];
            }
            if (filters.status) {
                query.status = filters.status;
            }
            if (filters.priority) {
                query.priority = filters.priority;
            }
            if (filters.serviceType) {
                query.serviceType = filters.serviceType;
            }
            const skip = (page - 1) * limit;
            const total = await core_1.ConsultationRequest.countDocuments(query);
            const requests = await core_1.ConsultationRequest.find(query)
                .populate('assignedTo', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
            return {
                requests,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách yêu cầu tư vấn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getConsultationRequestById(id) {
        try {
            const request = await core_1.ConsultationRequest.findById(id)
                .populate('assignedTo', 'name email')
                .lean();
            return request;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin yêu cầu tư vấn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createConsultationRequest(requestData) {
        try {
            const request = new core_1.ConsultationRequest(requestData);
            await request.save();
            return await core_1.ConsultationRequest.findById(request._id)
                .populate('assignedTo', 'name email')
                .lean();
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo yêu cầu tư vấn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateConsultationRequest(id, updateData) {
        try {
            const request = await core_1.ConsultationRequest.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true })
                .populate('assignedTo', 'name email')
                .lean();
            return request;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật yêu cầu tư vấn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async assignConsultationRequest(id, assignedTo) {
        try {
            const request = await core_1.ConsultationRequest.findByIdAndUpdate(id, { assignedTo, updatedAt: new Date() }, { new: true, runValidators: true })
                .populate('assignedTo', 'name email')
                .lean();
            return request;
        }
        catch (error) {
            throw new Error(`Lỗi khi phân công yêu cầu tư vấn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateConsultationRequestStatus(id, status) {
        try {
            const request = await core_1.ConsultationRequest.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true, runValidators: true })
                .populate('assignedTo', 'name email')
                .lean();
            return request;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật trạng thái yêu cầu tư vấn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.contactService = new ContactService();

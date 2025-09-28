import { ContactMessage, NewsletterSubscriber, NewsletterCampaign, ConsultationRequest } from '@/models/core';

export interface ContactFilters {
    search?: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
}

export interface ContactListResult {
    messages: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface NewsletterFilters {
    search?: string;
    status?: string;
    source?: string;
}

export interface NewsletterListResult {
    subscribers: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface ConsultationFilters {
    search?: string;
    status?: string;
    priority?: string;
    serviceType?: string;
}

export interface ConsultationListResult {
    requests: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

class ContactService {
    /**
     * Get all contact messages with pagination and filters
     */
    async getContactMessages(page: number, limit: number, filters: ContactFilters): Promise<ContactListResult> {
        try {
            const query: any = {};

            // Apply filters
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

            // Calculate pagination
            const skip = (page - 1) * limit;
            const total = await ContactMessage.countDocuments(query);

            // Get messages with pagination
            const messages = await ContactMessage.find(query)
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
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách tin nhắn liên hệ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get contact message by ID
     */
    async getContactMessageById(id: string): Promise<any> {
        try {
            const message = await ContactMessage.findById(id)
                .populate('assignedTo', 'name email')
                .lean();

            return message;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin tin nhắn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Create new contact message
     */
    async createContactMessage(messageData: any): Promise<any> {
        try {
            const message = new ContactMessage(messageData);
            await message.save();

            return await ContactMessage.findById(message._id)
                .populate('assignedTo', 'name email')
                .lean();
        } catch (error) {
            throw new Error(`Lỗi khi tạo tin nhắn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update contact message
     */
    async updateContactMessage(id: string, updateData: any): Promise<any> {
        try {
            const message = await ContactMessage.findByIdAndUpdate(
                id,
                { ...updateData, updatedAt: new Date() },
                { new: true, runValidators: true }
            )
                .populate('assignedTo', 'name email')
                .lean();

            return message;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật tin nhắn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete contact message
     */
    async deleteContactMessage(id: string): Promise<boolean> {
        try {
            const result = await ContactMessage.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Lỗi khi xóa tin nhắn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update contact message status
     */
    async updateContactMessageStatus(id: string, status: string): Promise<any> {
        try {
            const message = await ContactMessage.findByIdAndUpdate(
                id,
                { status, updatedAt: new Date() },
                { new: true, runValidators: true }
            )
                .populate('assignedTo', 'name email')
                .lean();

            return message;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật trạng thái tin nhắn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get newsletter subscribers
     */
    async getNewsletterSubscribers(page: number, limit: number, filters: NewsletterFilters): Promise<NewsletterListResult> {
        try {
            const query: any = {};

            // Apply filters
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

            // Calculate pagination
            const skip = (page - 1) * limit;
            const total = await NewsletterSubscriber.countDocuments(query);

            // Get subscribers with pagination
            const subscribers = await NewsletterSubscriber.find(query)
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
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách đăng ký nhận tin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Create newsletter subscriber
     */
    async createNewsletterSubscriber(subscriberData: any): Promise<any> {
        try {
            const subscriber = new NewsletterSubscriber(subscriberData);
            await subscriber.save();

            return subscriber;
        } catch (error) {
            throw new Error(`Lỗi khi tạo đăng ký nhận tin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete newsletter subscriber
     */
    async deleteNewsletterSubscriber(id: string): Promise<boolean> {
        try {
            const result = await NewsletterSubscriber.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Lỗi khi xóa đăng ký nhận tin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get newsletter campaigns
     */
    async getNewsletterCampaigns(page: number, limit: number, filters: any): Promise<any> {
        try {
            const query: any = {};

            // Apply filters
            if (filters.search) {
                query.$or = [
                    { name: { $regex: filters.search, $options: 'i' } },
                    { subject: { $regex: filters.search, $options: 'i' } }
                ];
            }

            if (filters.status) {
                query.status = filters.status;
            }

            // Calculate pagination
            const skip = (page - 1) * limit;
            const total = await NewsletterCampaign.countDocuments(query);

            // Get campaigns with pagination
            const campaigns = await NewsletterCampaign.find(query)
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
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách chiến dịch email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Create newsletter campaign
     */
    async createNewsletterCampaign(campaignData: any): Promise<any> {
        try {
            const campaign = new NewsletterCampaign(campaignData);
            await campaign.save();

            return await NewsletterCampaign.findById(campaign._id)
                .populate('createdBy', 'name email')
                .lean();
        } catch (error) {
            throw new Error(`Lỗi khi tạo chiến dịch email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Send newsletter campaign
     */
    async sendNewsletterCampaign(id: string): Promise<any> {
        try {
            const campaign = await NewsletterCampaign.findByIdAndUpdate(
                id,
                {
                    status: 'sending',
                    sentAt: new Date(),
                    updatedAt: new Date()
                },
                { new: true, runValidators: true }
            )
                .populate('createdBy', 'name email')
                .lean();

            // TODO: Implement actual email sending logic here
            // This would involve:
            // 1. Getting active subscribers
            // 2. Sending emails in batches
            // 3. Updating campaign statistics
            // 4. Handling bounces and unsubscribes

            return campaign;
        } catch (error) {
            throw new Error(`Lỗi khi gửi chiến dịch email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get consultation requests
     */
    async getConsultationRequests(page: number, limit: number, filters: ConsultationFilters): Promise<ConsultationListResult> {
        try {
            const query: any = {};

            // Apply filters
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

            // Calculate pagination
            const skip = (page - 1) * limit;
            const total = await ConsultationRequest.countDocuments(query);

            // Get requests with pagination
            const requests = await ConsultationRequest.find(query)
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
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách yêu cầu tư vấn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get consultation request by ID
     */
    async getConsultationRequestById(id: string): Promise<any> {
        try {
            const request = await ConsultationRequest.findById(id)
                .populate('assignedTo', 'name email')
                .lean();

            return request;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin yêu cầu tư vấn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Create consultation request
     */
    async createConsultationRequest(requestData: any): Promise<any> {
        try {
            const request = new ConsultationRequest(requestData);
            await request.save();

            return await ConsultationRequest.findById(request._id)
                .populate('assignedTo', 'name email')
                .lean();
        } catch (error) {
            throw new Error(`Lỗi khi tạo yêu cầu tư vấn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update consultation request
     */
    async updateConsultationRequest(id: string, updateData: any): Promise<any> {
        try {
            const request = await ConsultationRequest.findByIdAndUpdate(
                id,
                { ...updateData, updatedAt: new Date() },
                { new: true, runValidators: true }
            )
                .populate('assignedTo', 'name email')
                .lean();

            return request;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật yêu cầu tư vấn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Assign consultation request
     */
    async assignConsultationRequest(id: string, assignedTo: string): Promise<any> {
        try {
            const request = await ConsultationRequest.findByIdAndUpdate(
                id,
                { assignedTo, updatedAt: new Date() },
                { new: true, runValidators: true }
            )
                .populate('assignedTo', 'name email')
                .lean();

            return request;
        } catch (error) {
            throw new Error(`Lỗi khi phân công yêu cầu tư vấn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update consultation request status
     */
    async updateConsultationRequestStatus(id: string, status: string): Promise<any> {
        try {
            const request = await ConsultationRequest.findByIdAndUpdate(
                id,
                { status, updatedAt: new Date() },
                { new: true, runValidators: true }
            )
                .populate('assignedTo', 'name email')
                .lean();

            return request;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật trạng thái yêu cầu tư vấn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const contactService = new ContactService();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactService = void 0;
const core_1 = require("@/models/core");
class ContactService {
    async createContactMessage(messageData) {
        try {
            const message = new core_1.ContactMessage(messageData);
            await message.save();
            return await core_1.ContactMessage.findById(message._id)
                .select('-__v')
                .lean();
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo tin nhắn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createConsultationRequest(requestData) {
        try {
            const request = new core_1.ConsultationRequest(requestData);
            await request.save();
            return await core_1.ConsultationRequest.findById(request._id)
                .select('-__v')
                .lean();
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo yêu cầu tư vấn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async subscribeNewsletter(subscriberData) {
        try {
            const existingSubscriber = await core_1.NewsletterSubscriber.findOne({
                email: subscriberData.email
            });
            if (existingSubscriber) {
                if (existingSubscriber.status === 'active') {
                    throw new Error('Email này đã đăng ký nhận tin rồi');
                }
                else {
                    existingSubscriber.status = 'active';
                    existingSubscriber.subscribedAt = new Date();
                    existingSubscriber.unsubscribedAt = null;
                    await existingSubscriber.save();
                    return existingSubscriber;
                }
            }
            const subscriber = new core_1.NewsletterSubscriber(subscriberData);
            await subscriber.save();
            return subscriber;
        }
        catch (error) {
            throw new Error(`Lỗi khi đăng ký nhận tin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async unsubscribeNewsletter(email) {
        try {
            const subscriber = await core_1.NewsletterSubscriber.findOne({ email });
            if (!subscriber) {
                return false;
            }
            subscriber.status = 'unsubscribed';
            subscriber.unsubscribedAt = new Date();
            await subscriber.save();
            return true;
        }
        catch (error) {
            throw new Error(`Lỗi khi hủy đăng ký nhận tin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async verifyNewsletterSubscription(token) {
        try {
            return true;
        }
        catch (error) {
            throw new Error(`Lỗi khi xác thực đăng ký nhận tin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.contactService = new ContactService();

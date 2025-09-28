import { ContactMessage, NewsletterSubscriber, ConsultationRequest } from '@/models/core';

class ContactService {
    /**
     * Create contact message
     */
    async createContactMessage(messageData: any): Promise<any> {
        try {
            const message = new ContactMessage(messageData);
            await message.save();

            return await ContactMessage.findById(message._id)
                .select('-__v')
                .lean();
        } catch (error) {
            throw new Error(`Lỗi khi tạo tin nhắn: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                .select('-__v')
                .lean();
        } catch (error) {
            throw new Error(`Lỗi khi tạo yêu cầu tư vấn: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Subscribe to newsletter
     */
    async subscribeNewsletter(subscriberData: any): Promise<any> {
        try {
            // Check if email already exists
            const existingSubscriber = await NewsletterSubscriber.findOne({
                email: subscriberData.email
            });

            if (existingSubscriber) {
                if (existingSubscriber.status === 'active') {
                    throw new Error('Email này đã đăng ký nhận tin rồi');
                } else {
                    // Reactivate existing subscriber
                    existingSubscriber.status = 'active';
                    existingSubscriber.subscribedAt = new Date();
                    existingSubscriber.unsubscribedAt = null as any;
                    await existingSubscriber.save();
                    return existingSubscriber;
                }
            }

            const subscriber = new NewsletterSubscriber(subscriberData);
            await subscriber.save();

            return subscriber;
        } catch (error) {
            throw new Error(`Lỗi khi đăng ký nhận tin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Unsubscribe from newsletter
     */
    async unsubscribeNewsletter(email: string): Promise<boolean> {
        try {
            const subscriber = await NewsletterSubscriber.findOne({ email });
            if (!subscriber) {
                return false;
            }

            subscriber.status = 'unsubscribed';
            subscriber.unsubscribedAt = new Date();
            await subscriber.save();

            return true;
        } catch (error) {
            throw new Error(`Lỗi khi hủy đăng ký nhận tin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Verify newsletter subscription
     */
    async verifyNewsletterSubscription(token: string): Promise<boolean> {
        try {
            // TODO: Implement token verification logic
            // This would involve checking a verification token
            // and updating the subscriber status

            // For now, just return true as a placeholder
            return true;
        } catch (error) {
            throw new Error(`Lỗi khi xác thực đăng ký nhận tin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const contactService = new ContactService();

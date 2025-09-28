import { SystemSetting, EmailTemplate } from '../../models/core';
import { fileService } from '../shared/fileService';

class SettingsService {
    /**
     * Get general settings
     */
    async getGeneralSettings(): Promise<any> {
        try {
            const settings = await SystemSetting.find({ group: 'general' }).lean();

            const settingsObj: any = {};
            settings.forEach(setting => {
                settingsObj[setting.key] = setting.value;
            });

            return settingsObj;
        } catch (error) {
            throw new Error(`Lỗi khi lấy cài đặt chung: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update general settings
     */
    async updateGeneralSettings(settingsData: any, updatedBy?: string): Promise<any> {
        try {
            const updatedSettings: any = {};

            for (const [key, value] of Object.entries(settingsData)) {
                const setting = await SystemSetting.findOneAndUpdate(
                    { key, group: 'general' },
                    {
                        value,
                        updatedBy,
                        updatedAt: new Date()
                    },
                    {
                        upsert: true,
                        new: true,
                        runValidators: true
                    }
                );
                updatedSettings[key] = setting.value;
            }

            return updatedSettings;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật cài đặt chung: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Upload logo
     */
    async uploadLogo(file: Express.Multer.File): Promise<string> {
        try {
            const logoUrl = await fileService.uploadImage(file);
            return logoUrl;
        } catch (error) {
            throw new Error(`Lỗi khi upload logo: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Upload favicon
     */
    async uploadFavicon(file: Express.Multer.File): Promise<string> {
        try {
            const faviconUrl = await fileService.uploadImage(file);
            return faviconUrl;
        } catch (error) {
            throw new Error(`Lỗi khi upload favicon: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get API settings
     */
    async getApiSettings(): Promise<any> {
        try {
            const settings = await SystemSetting.find({ group: 'api' }).lean();

            const settingsObj: any = {};
            settings.forEach(setting => {
                settingsObj[setting.key] = setting.value;
            });

            return settingsObj;
        } catch (error) {
            throw new Error(`Lỗi khi lấy cài đặt API: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update API settings
     */
    async updateApiSettings(settingsData: any, updatedBy?: string): Promise<any> {
        try {
            const updatedSettings: any = {};

            for (const [key, value] of Object.entries(settingsData)) {
                const setting = await SystemSetting.findOneAndUpdate(
                    { key, group: 'api' },
                    {
                        value,
                        updatedBy,
                        updatedAt: new Date()
                    },
                    {
                        upsert: true,
                        new: true,
                        runValidators: true
                    }
                );
                updatedSettings[key] = setting.value;
            }

            return updatedSettings;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật cài đặt API: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get API keys
     */
    async getApiKeys(): Promise<any[]> {
        try {
            const apiKeys = await SystemSetting.find({
                group: 'api',
                key: { $regex: /^api_key_/ }
            }).lean();

            return apiKeys.map(key => ({
                id: key._id,
                name: key.key.replace('api_key_', ''),
                key: key.key,
                description: key.description,
                isActive: key.isPublic,
                createdAt: key.createdAt,
                updatedAt: key.updatedAt
            }));
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách API keys: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Create API key
     */
    async createApiKey(keyData: any, createdBy?: string): Promise<any> {
        try {
            const apiKey = `api_key_${keyData.name.toLowerCase().replace(/\s+/g, '_')}`;
            const setting = new SystemSetting({
                key: apiKey,
                value: keyData.value,
                type: 'text',
                group: 'api',
                description: keyData.description,
                isPublic: keyData.isActive || false,
                updatedBy: createdBy
            });

            await setting.save();

            return {
                id: setting._id,
                name: keyData.name,
                key: apiKey,
                description: keyData.description,
                isActive: keyData.isActive || false,
                createdAt: setting.createdAt,
                updatedAt: setting.updatedAt
            };
        } catch (error) {
            throw new Error(`Lỗi khi tạo API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete API key
     */
    async deleteApiKey(id: string): Promise<boolean> {
        try {
            const result = await SystemSetting.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Lỗi khi xóa API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Test API connection
     */
    async testApiConnection(apiKey: string): Promise<any> {
        try {
            // TODO: Implement actual API connection testing
            // This would involve making a test request to the external API
            // and verifying the response

            return {
                success: true,
                message: 'Kết nối API thành công',
                responseTime: Math.random() * 1000 + 100, // Mock response time
                status: 'connected'
            };
        } catch (error) {
            throw new Error(`Lỗi khi test kết nối API: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get email settings
     */
    async getEmailSettings(): Promise<any> {
        try {
            const settings = await SystemSetting.find({ group: 'email' }).lean();

            const settingsObj: any = {};
            settings.forEach(setting => {
                settingsObj[setting.key] = setting.value;
            });

            return settingsObj;
        } catch (error) {
            throw new Error(`Lỗi khi lấy cài đặt email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update email settings
     */
    async updateEmailSettings(settingsData: any, updatedBy?: string): Promise<any> {
        try {
            const updatedSettings: any = {};

            for (const [key, value] of Object.entries(settingsData)) {
                const setting = await SystemSetting.findOneAndUpdate(
                    { key, group: 'email' },
                    {
                        value,
                        updatedBy,
                        updatedAt: new Date()
                    },
                    {
                        upsert: true,
                        new: true,
                        runValidators: true
                    }
                );
                updatedSettings[key] = setting.value;
            }

            return updatedSettings;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật cài đặt email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get email templates
     */
    async getEmailTemplates(): Promise<any[]> {
        try {
            const templates = await EmailTemplate.find({ isActive: true })
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email')
                .sort({ name: 1 })
                .lean();

            return templates;
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách template email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Create email template
     */
    async createEmailTemplate(templateData: any, createdBy?: string): Promise<any> {
        try {
            const template = new EmailTemplate({
                ...templateData,
                createdBy,
                updatedBy: createdBy
            });

            await template.save();

            return await EmailTemplate.findById(template._id)
                .populate('createdBy', 'name email')
                .lean();
        } catch (error) {
            throw new Error(`Lỗi khi tạo template email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update email template
     */
    async updateEmailTemplate(id: string, updateData: any, updatedBy?: string): Promise<any> {
        try {
            const template = await EmailTemplate.findByIdAndUpdate(
                id,
                { ...updateData, updatedBy, updatedAt: new Date() },
                { new: true, runValidators: true }
            )
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email')
                .lean();

            return template;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật template email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete email template
     */
    async deleteEmailTemplate(id: string): Promise<boolean> {
        try {
            const result = await EmailTemplate.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Lỗi khi xóa template email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Test email sending
     */
    async testEmailSending(to: string, subject: string, content: string): Promise<any> {
        try {
            // TODO: Implement actual email sending logic
            // This would involve using a service like SendGrid, AWS SES, or Nodemailer
            // to send a test email

            return {
                success: true,
                message: 'Gửi email test thành công',
                messageId: `test_${Date.now()}`,
                recipient: to
            };
        } catch (error) {
            throw new Error(`Lỗi khi test gửi email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get social media settings
     */
    async getSocialSettings(): Promise<any> {
        try {
            const settings = await SystemSetting.find({ group: 'social' }).lean();

            const settingsObj: any = {};
            settings.forEach(setting => {
                settingsObj[setting.key] = setting.value;
            });

            return settingsObj;
        } catch (error) {
            throw new Error(`Lỗi khi lấy cài đặt mạng xã hội: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update social media settings
     */
    async updateSocialSettings(settingsData: any, updatedBy?: string): Promise<any> {
        try {
            const updatedSettings: any = {};

            for (const [key, value] of Object.entries(settingsData)) {
                const setting = await SystemSetting.findOneAndUpdate(
                    { key, group: 'social' },
                    {
                        value,
                        updatedBy,
                        updatedAt: new Date()
                    },
                    {
                        upsert: true,
                        new: true,
                        runValidators: true
                    }
                );
                updatedSettings[key] = setting.value;
            }

            return updatedSettings;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật cài đặt mạng xã hội: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get social links
     */
    async getSocialLinks(): Promise<any[]> {
        try {
            const socialLinks = await SystemSetting.find({
                group: 'social',
                key: { $regex: /^social_link_/ }
            }).lean();

            return socialLinks.map(link => ({
                id: link._id,
                platform: link.key.replace('social_link_', ''),
                url: link.value,
                description: link.description,
                isActive: link.isPublic,
                createdAt: link.createdAt,
                updatedAt: link.updatedAt
            }));
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách liên kết mạng xã hội: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Create social link
     */
    async createSocialLink(linkData: any): Promise<any> {
        try {
            const linkKey = `social_link_${linkData.platform.toLowerCase()}`;
            const setting = new SystemSetting({
                key: linkKey,
                value: linkData.url,
                type: 'text',
                group: 'social',
                description: linkData.description,
                isPublic: linkData.isActive || false
            });

            await setting.save();

            return {
                id: setting._id,
                platform: linkData.platform,
                url: linkData.url,
                description: linkData.description,
                isActive: linkData.isActive || false,
                createdAt: setting.createdAt,
                updatedAt: setting.updatedAt
            };
        } catch (error) {
            throw new Error(`Lỗi khi tạo liên kết mạng xã hội: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update social link
     */
    async updateSocialLink(id: string, updateData: any): Promise<any> {
        try {
            const setting = await SystemSetting.findByIdAndUpdate(
                id,
                {
                    value: updateData.url,
                    description: updateData.description,
                    isPublic: updateData.isActive || false,
                    updatedAt: new Date()
                },
                { new: true, runValidators: true }
            );

            if (!setting) {
                return null;
            }

            return {
                id: setting._id,
                platform: setting.key.replace('social_link_', ''),
                url: setting.value,
                description: setting.description,
                isActive: setting.isPublic,
                createdAt: setting.createdAt,
                updatedAt: setting.updatedAt
            };
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật liên kết mạng xã hội: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete social link
     */
    async deleteSocialLink(id: string): Promise<boolean> {
        try {
            const result = await SystemSetting.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Lỗi khi xóa liên kết mạng xã hội: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const settingsService = new SettingsService();

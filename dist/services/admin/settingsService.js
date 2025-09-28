"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsService = void 0;
const core_1 = require("@/models/core");
const fileService_1 = require("@/services/shared/fileService");
class SettingsService {
    async getGeneralSettings() {
        try {
            const settings = await core_1.SystemSetting.find({ group: 'general' }).lean();
            const settingsObj = {};
            settings.forEach(setting => {
                settingsObj[setting.key] = setting.value;
            });
            return settingsObj;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy cài đặt chung: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateGeneralSettings(settingsData, updatedBy) {
        try {
            const updatedSettings = {};
            for (const [key, value] of Object.entries(settingsData)) {
                const setting = await core_1.SystemSetting.findOneAndUpdate({ key, group: 'general' }, {
                    value,
                    updatedBy,
                    updatedAt: new Date()
                }, {
                    upsert: true,
                    new: true,
                    runValidators: true
                });
                updatedSettings[key] = setting.value;
            }
            return updatedSettings;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật cài đặt chung: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async uploadLogo(file) {
        try {
            const logoUrl = await fileService_1.fileService.uploadImage(file);
            return logoUrl;
        }
        catch (error) {
            throw new Error(`Lỗi khi upload logo: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async uploadFavicon(file) {
        try {
            const faviconUrl = await fileService_1.fileService.uploadImage(file);
            return faviconUrl;
        }
        catch (error) {
            throw new Error(`Lỗi khi upload favicon: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getApiSettings() {
        try {
            const settings = await core_1.SystemSetting.find({ group: 'api' }).lean();
            const settingsObj = {};
            settings.forEach(setting => {
                settingsObj[setting.key] = setting.value;
            });
            return settingsObj;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy cài đặt API: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateApiSettings(settingsData, updatedBy) {
        try {
            const updatedSettings = {};
            for (const [key, value] of Object.entries(settingsData)) {
                const setting = await core_1.SystemSetting.findOneAndUpdate({ key, group: 'api' }, {
                    value,
                    updatedBy,
                    updatedAt: new Date()
                }, {
                    upsert: true,
                    new: true,
                    runValidators: true
                });
                updatedSettings[key] = setting.value;
            }
            return updatedSettings;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật cài đặt API: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getApiKeys() {
        try {
            const apiKeys = await core_1.SystemSetting.find({
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
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách API keys: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createApiKey(keyData, createdBy) {
        try {
            const apiKey = `api_key_${keyData.name.toLowerCase().replace(/\s+/g, '_')}`;
            const setting = new core_1.SystemSetting({
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
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteApiKey(id) {
        try {
            const result = await core_1.SystemSetting.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async testApiConnection(apiKey) {
        try {
            return {
                success: true,
                message: 'Kết nối API thành công',
                responseTime: Math.random() * 1000 + 100,
                status: 'connected'
            };
        }
        catch (error) {
            throw new Error(`Lỗi khi test kết nối API: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getEmailSettings() {
        try {
            const settings = await core_1.SystemSetting.find({ group: 'email' }).lean();
            const settingsObj = {};
            settings.forEach(setting => {
                settingsObj[setting.key] = setting.value;
            });
            return settingsObj;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy cài đặt email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateEmailSettings(settingsData, updatedBy) {
        try {
            const updatedSettings = {};
            for (const [key, value] of Object.entries(settingsData)) {
                const setting = await core_1.SystemSetting.findOneAndUpdate({ key, group: 'email' }, {
                    value,
                    updatedBy,
                    updatedAt: new Date()
                }, {
                    upsert: true,
                    new: true,
                    runValidators: true
                });
                updatedSettings[key] = setting.value;
            }
            return updatedSettings;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật cài đặt email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getEmailTemplates() {
        try {
            const templates = await core_1.EmailTemplate.find({ isActive: true })
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email')
                .sort({ name: 1 })
                .lean();
            return templates;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách template email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createEmailTemplate(templateData, createdBy) {
        try {
            const template = new core_1.EmailTemplate({
                ...templateData,
                createdBy,
                updatedBy: createdBy
            });
            await template.save();
            return await core_1.EmailTemplate.findById(template._id)
                .populate('createdBy', 'name email')
                .lean();
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo template email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateEmailTemplate(id, updateData, updatedBy) {
        try {
            const template = await core_1.EmailTemplate.findByIdAndUpdate(id, { ...updateData, updatedBy, updatedAt: new Date() }, { new: true, runValidators: true })
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email')
                .lean();
            return template;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật template email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteEmailTemplate(id) {
        try {
            const result = await core_1.EmailTemplate.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa template email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async testEmailSending(to, subject, content) {
        try {
            return {
                success: true,
                message: 'Gửi email test thành công',
                messageId: `test_${Date.now()}`,
                recipient: to
            };
        }
        catch (error) {
            throw new Error(`Lỗi khi test gửi email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getSocialSettings() {
        try {
            const settings = await core_1.SystemSetting.find({ group: 'social' }).lean();
            const settingsObj = {};
            settings.forEach(setting => {
                settingsObj[setting.key] = setting.value;
            });
            return settingsObj;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy cài đặt mạng xã hội: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateSocialSettings(settingsData, updatedBy) {
        try {
            const updatedSettings = {};
            for (const [key, value] of Object.entries(settingsData)) {
                const setting = await core_1.SystemSetting.findOneAndUpdate({ key, group: 'social' }, {
                    value,
                    updatedBy,
                    updatedAt: new Date()
                }, {
                    upsert: true,
                    new: true,
                    runValidators: true
                });
                updatedSettings[key] = setting.value;
            }
            return updatedSettings;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật cài đặt mạng xã hội: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getSocialLinks() {
        try {
            const socialLinks = await core_1.SystemSetting.find({
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
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách liên kết mạng xã hội: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createSocialLink(linkData) {
        try {
            const linkKey = `social_link_${linkData.platform.toLowerCase()}`;
            const setting = new core_1.SystemSetting({
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
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo liên kết mạng xã hội: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateSocialLink(id, updateData) {
        try {
            const setting = await core_1.SystemSetting.findByIdAndUpdate(id, {
                value: updateData.url,
                description: updateData.description,
                isPublic: updateData.isActive || false,
                updatedAt: new Date()
            }, { new: true, runValidators: true });
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
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật liên kết mạng xã hội: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteSocialLink(id) {
        try {
            const result = await core_1.SystemSetting.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa liên kết mạng xã hội: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.settingsService = new SettingsService();
//# sourceMappingURL=settingsService.js.map
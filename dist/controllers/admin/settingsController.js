"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSocialLink = exports.updateSocialLink = exports.createSocialLink = exports.getSocialLinks = exports.updateSocialSettings = exports.getSocialSettings = exports.testEmailSending = exports.deleteEmailTemplate = exports.updateEmailTemplate = exports.createEmailTemplate = exports.getEmailTemplates = exports.updateEmailSettings = exports.getEmailSettings = exports.testApiConnection = exports.deleteApiKey = exports.createApiKey = exports.getApiKeys = exports.updateApiSettings = exports.getApiSettings = exports.uploadFavicon = exports.uploadLogo = exports.updateGeneralSettings = exports.getGeneralSettings = void 0;
const settingsService_1 = require("@/services/admin/settingsService");
const getGeneralSettings = async (req, res) => {
    try {
        const settings = await settingsService_1.settingsService.getGeneralSettings();
        res.json({
            success: true,
            data: settings
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy cài đặt chung',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getGeneralSettings = getGeneralSettings;
const updateGeneralSettings = async (req, res) => {
    try {
        const settings = await settingsService_1.settingsService.updateGeneralSettings(req.body, req.user?.id);
        res.json({
            success: true,
            message: 'Cập nhật cài đặt chung thành công',
            data: settings
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật cài đặt chung',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.updateGeneralSettings = updateGeneralSettings;
const uploadLogo = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).json({
                success: false,
                message: 'Không có file logo được upload'
            });
            ;
            return;
        }
        const logoUrl = await settingsService_1.settingsService.uploadLogo(file);
        await settingsService_1.settingsService.updateGeneralSettings({ site_logo: logoUrl }, req.user?.id);
        res.json({
            success: true,
            message: 'Upload logo thành công',
            data: { logoUrl }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload logo',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.uploadLogo = uploadLogo;
const uploadFavicon = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).json({
                success: false,
                message: 'Không có file favicon được upload'
            });
            ;
            return;
        }
        const faviconUrl = await settingsService_1.settingsService.uploadFavicon(file);
        await settingsService_1.settingsService.updateGeneralSettings({ site_favicon: faviconUrl }, req.user?.id);
        res.json({
            success: true,
            message: 'Upload favicon thành công',
            data: { faviconUrl }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload favicon',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.uploadFavicon = uploadFavicon;
const getApiSettings = async (req, res) => {
    try {
        const settings = await settingsService_1.settingsService.getApiSettings();
        res.json({
            success: true,
            data: settings
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy cài đặt API',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getApiSettings = getApiSettings;
const updateApiSettings = async (req, res) => {
    try {
        const settings = await settingsService_1.settingsService.updateApiSettings(req.body, req.user?.id);
        res.json({
            success: true,
            message: 'Cập nhật cài đặt API thành công',
            data: settings
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật cài đặt API',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.updateApiSettings = updateApiSettings;
const getApiKeys = async (req, res) => {
    try {
        const apiKeys = await settingsService_1.settingsService.getApiKeys();
        res.json({
            success: true,
            data: apiKeys
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách API keys',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getApiKeys = getApiKeys;
const createApiKey = async (req, res) => {
    try {
        const apiKey = await settingsService_1.settingsService.createApiKey(req.body, req.user?.id);
        res.status(201).json({
            success: true,
            message: 'Tạo API key thành công',
            data: apiKey
        });
        ;
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo API key',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.createApiKey = createApiKey;
const deleteApiKey = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await settingsService_1.settingsService.deleteApiKey(id);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy API key'
            });
            ;
            return;
        }
        res.json({
            success: true,
            message: 'Xóa API key thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa API key',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.deleteApiKey = deleteApiKey;
const testApiConnection = async (req, res) => {
    try {
        const { apiKey } = req.body;
        const result = await settingsService_1.settingsService.testApiConnection(apiKey);
        res.json({
            success: true,
            message: 'Test kết nối API thành công',
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi test kết nối API',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.testApiConnection = testApiConnection;
const getEmailSettings = async (req, res) => {
    try {
        const settings = await settingsService_1.settingsService.getEmailSettings();
        res.json({
            success: true,
            data: settings
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy cài đặt email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getEmailSettings = getEmailSettings;
const updateEmailSettings = async (req, res) => {
    try {
        const settings = await settingsService_1.settingsService.updateEmailSettings(req.body, req.user?.id);
        res.json({
            success: true,
            message: 'Cập nhật cài đặt email thành công',
            data: settings
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật cài đặt email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.updateEmailSettings = updateEmailSettings;
const getEmailTemplates = async (req, res) => {
    try {
        const templates = await settingsService_1.settingsService.getEmailTemplates();
        res.json({
            success: true,
            data: templates
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách template email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getEmailTemplates = getEmailTemplates;
const createEmailTemplate = async (req, res) => {
    try {
        const template = await settingsService_1.settingsService.createEmailTemplate(req.body, req.user?.id);
        res.status(201).json({
            success: true,
            message: 'Tạo template email thành công',
            data: template
        });
        ;
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo template email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.createEmailTemplate = createEmailTemplate;
const updateEmailTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await settingsService_1.settingsService.updateEmailTemplate(id, req.body, req.user?.id);
        if (!template) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy template email'
            });
            ;
            return;
        }
        res.json({
            success: true,
            message: 'Cập nhật template email thành công',
            data: template
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật template email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.updateEmailTemplate = updateEmailTemplate;
const deleteEmailTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await settingsService_1.settingsService.deleteEmailTemplate(id);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy template email'
            });
            ;
            return;
        }
        res.json({
            success: true,
            message: 'Xóa template email thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa template email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.deleteEmailTemplate = deleteEmailTemplate;
const testEmailSending = async (req, res) => {
    try {
        const { to, subject, content } = req.body;
        const result = await settingsService_1.settingsService.testEmailSending(to, subject, content);
        res.json({
            success: true,
            message: 'Test gửi email thành công',
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi test gửi email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.testEmailSending = testEmailSending;
const getSocialSettings = async (req, res) => {
    try {
        const settings = await settingsService_1.settingsService.getSocialSettings();
        res.json({
            success: true,
            data: settings
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy cài đặt mạng xã hội',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getSocialSettings = getSocialSettings;
const updateSocialSettings = async (req, res) => {
    try {
        const settings = await settingsService_1.settingsService.updateSocialSettings(req.body, req.user?.id);
        res.json({
            success: true,
            message: 'Cập nhật cài đặt mạng xã hội thành công',
            data: settings
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật cài đặt mạng xã hội',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.updateSocialSettings = updateSocialSettings;
const getSocialLinks = async (req, res) => {
    try {
        const links = await settingsService_1.settingsService.getSocialLinks();
        res.json({
            success: true,
            data: links
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách liên kết mạng xã hội',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getSocialLinks = getSocialLinks;
const createSocialLink = async (req, res) => {
    try {
        const link = await settingsService_1.settingsService.createSocialLink(req.body);
        res.status(201).json({
            success: true,
            message: 'Tạo liên kết mạng xã hội thành công',
            data: link
        });
        ;
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo liên kết mạng xã hội',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.createSocialLink = createSocialLink;
const updateSocialLink = async (req, res) => {
    try {
        const { id } = req.params;
        const link = await settingsService_1.settingsService.updateSocialLink(id, req.body);
        if (!link) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy liên kết mạng xã hội'
            });
            ;
            return;
        }
        res.json({
            success: true,
            message: 'Cập nhật liên kết mạng xã hội thành công',
            data: link
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật liên kết mạng xã hội',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.updateSocialLink = updateSocialLink;
const deleteSocialLink = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await settingsService_1.settingsService.deleteSocialLink(id);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy liên kết mạng xã hội'
            });
            ;
            return;
        }
        res.json({
            success: true,
            message: 'Xóa liên kết mạng xã hội thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa liên kết mạng xã hội',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.deleteSocialLink = deleteSocialLink;

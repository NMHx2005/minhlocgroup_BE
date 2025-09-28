import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { settingsService } from '@/services/admin/settingsService';

/**
 * Get general settings
 * GET /api/v1/settings/general
 */
export const getGeneralSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const settings = await settingsService.getGeneralSettings();
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy cài đặt chung',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Update general settings
 * PUT /api/v1/settings/general
 */
export const updateGeneralSettings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const settings = await settingsService.updateGeneralSettings(req.body, req.user?.id);

        res.json({
            success: true,
            message: 'Cập nhật cài đặt chung thành công',
            data: settings
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật cài đặt chung',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Upload logo
 * POST /api/v1/settings/upload-logo
 */
export const uploadLogo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).json({
                success: false,
                message: 'Không có file logo được upload'
            });;

            return;
        }

        const logoUrl = await settingsService.uploadLogo(file as any);
        await settingsService.updateGeneralSettings(
            { site_logo: logoUrl },
            req.user?.id
        );

        res.json({
            success: true,
            message: 'Upload logo thành công',
            data: { logoUrl }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload logo',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Upload favicon
 * POST /api/v1/settings/upload-favicon
 */
export const uploadFavicon = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).json({
                success: false,
                message: 'Không có file favicon được upload'
            });;

            return;
        }

        const faviconUrl = await settingsService.uploadFavicon(file as any);
        await settingsService.updateGeneralSettings(
            { site_favicon: faviconUrl },
            req.user?.id
        );

        res.json({
            success: true,
            message: 'Upload favicon thành công',
            data: { faviconUrl }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload favicon',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get API settings
 * GET /api/v1/settings/api
 */
export const getApiSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const settings = await settingsService.getApiSettings();
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy cài đặt API',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Update API settings
 * PUT /api/v1/settings/api
 */
export const updateApiSettings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const settings = await settingsService.updateApiSettings(req.body, req.user?.id);

        res.json({
            success: true,
            message: 'Cập nhật cài đặt API thành công',
            data: settings
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật cài đặt API',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get API keys
 * GET /api/v1/api-keys
 */
export const getApiKeys = async (req: Request, res: Response): Promise<void> => {
    try {
        const apiKeys = await settingsService.getApiKeys();
        res.json({
            success: true,
            data: apiKeys
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách API keys',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Create API key
 * POST /api/v1/api-keys
 */
export const createApiKey = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const apiKey = await settingsService.createApiKey(req.body, req.user?.id); res.status(201).json({
            success: true,
            message: 'Tạo API key thành công',
            data: apiKey
        });;


        return;
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo API key',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Delete API key
 * DELETE /api/v1/api-keys/:id
 */
export const deleteApiKey = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await settingsService.deleteApiKey(id as string);

        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy API key'
            });;

            return;
        }

        res.json({
            success: true,
            message: 'Xóa API key thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa API key',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Test API connection
 * POST /api/v1/api-keys/test
 */
export const testApiConnection = async (req: Request, res: Response): Promise<void> => {
    try {
        const { apiKey } = req.body;
        const result = await settingsService.testApiConnection(apiKey as string);

        res.json({
            success: true,
            message: 'Test kết nối API thành công',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi test kết nối API',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get email settings
 * GET /api/v1/settings/email
 */
export const getEmailSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const settings = await settingsService.getEmailSettings();
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy cài đặt email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Update email settings
 * PUT /api/v1/settings/email
 */
export const updateEmailSettings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const settings = await settingsService.updateEmailSettings(req.body, req.user?.id);

        res.json({
            success: true,
            message: 'Cập nhật cài đặt email thành công',
            data: settings
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật cài đặt email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get email templates
 * GET /api/v1/email-templates
 */
export const getEmailTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
        const templates = await settingsService.getEmailTemplates();
        res.json({
            success: true,
            data: templates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách template email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Create email template
 * POST /api/v1/email-templates
 */
export const createEmailTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const template = await settingsService.createEmailTemplate(req.body, req.user?.id); res.status(201).json({
            success: true,
            message: 'Tạo template email thành công',
            data: template
        });;


        return;
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo template email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Update email template
 * PUT /api/v1/email-templates/:id
 */
export const updateEmailTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const template = await settingsService.updateEmailTemplate(id as string, req.body, req.user?.id);

        if (!template) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy template email'
            });;

            return;
        }

        res.json({
            success: true,
            message: 'Cập nhật template email thành công',
            data: template
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật template email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Delete email template
 * DELETE /api/v1/email-templates/:id
 */
export const deleteEmailTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await settingsService.deleteEmailTemplate(id as string);

        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy template email'
            });;

            return;
        }

        res.json({
            success: true,
            message: 'Xóa template email thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa template email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Test email sending
 * POST /api/v1/settings/email/test
 */
export const testEmailSending = async (req: Request, res: Response): Promise<void> => {
    try {
        const { to, subject, content } = req.body;
        const result = await settingsService.testEmailSending(to, subject, content);

        res.json({
            success: true,
            message: 'Test gửi email thành công',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi test gửi email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get social media settings
 * GET /api/v1/settings/social
 */
export const getSocialSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const settings = await settingsService.getSocialSettings();
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy cài đặt mạng xã hội',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Update social media settings
 * PUT /api/v1/settings/social
 */
export const updateSocialSettings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const settings = await settingsService.updateSocialSettings(req.body, req.user?.id);

        res.json({
            success: true,
            message: 'Cập nhật cài đặt mạng xã hội thành công',
            data: settings
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật cài đặt mạng xã hội',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get social links
 * GET /api/v1/social-links
 */
export const getSocialLinks = async (req: Request, res: Response): Promise<void> => {
    try {
        const links = await settingsService.getSocialLinks();
        res.json({
            success: true,
            data: links
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách liên kết mạng xã hội',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Create social link
 * POST /api/v1/social-links
 */
export const createSocialLink = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const link = await settingsService.createSocialLink(req.body); res.status(201).json({
            success: true,
            message: 'Tạo liên kết mạng xã hội thành công',
            data: link
        });;


        return;
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo liên kết mạng xã hội',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Update social link
 * PUT /api/v1/social-links/:id
 */
export const updateSocialLink = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const link = await settingsService.updateSocialLink(id as string, req.body);

        if (!link) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy liên kết mạng xã hội'
            });;

            return;
        }

        res.json({
            success: true,
            message: 'Cập nhật liên kết mạng xã hội thành công',
            data: link
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật liên kết mạng xã hội',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Delete social link
 * DELETE /api/v1/social-links/:id
 */
export const deleteSocialLink = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await settingsService.deleteSocialLink(id as string);

        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy liên kết mạng xã hội'
            });;

            return;
        }

        res.json({
            success: true,
            message: 'Xóa liên kết mạng xã hội thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa liên kết mạng xã hội',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

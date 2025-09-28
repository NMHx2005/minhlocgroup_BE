declare class SettingsService {
    getGeneralSettings(): Promise<any>;
    updateGeneralSettings(settingsData: any, updatedBy?: string): Promise<any>;
    uploadLogo(file: Express.Multer.File): Promise<string>;
    uploadFavicon(file: Express.Multer.File): Promise<string>;
    getApiSettings(): Promise<any>;
    updateApiSettings(settingsData: any, updatedBy?: string): Promise<any>;
    getApiKeys(): Promise<any[]>;
    createApiKey(keyData: any, createdBy?: string): Promise<any>;
    deleteApiKey(id: string): Promise<boolean>;
    testApiConnection(apiKey: string): Promise<any>;
    getEmailSettings(): Promise<any>;
    updateEmailSettings(settingsData: any, updatedBy?: string): Promise<any>;
    getEmailTemplates(): Promise<any[]>;
    createEmailTemplate(templateData: any, createdBy?: string): Promise<any>;
    updateEmailTemplate(id: string, updateData: any, updatedBy?: string): Promise<any>;
    deleteEmailTemplate(id: string): Promise<boolean>;
    testEmailSending(to: string, subject: string, content: string): Promise<any>;
    getSocialSettings(): Promise<any>;
    updateSocialSettings(settingsData: any, updatedBy?: string): Promise<any>;
    getSocialLinks(): Promise<any[]>;
    createSocialLink(linkData: any): Promise<any>;
    updateSocialLink(id: string, updateData: any): Promise<any>;
    deleteSocialLink(id: string): Promise<boolean>;
}
export declare const settingsService: SettingsService;
export {};
//# sourceMappingURL=settingsService.d.ts.map
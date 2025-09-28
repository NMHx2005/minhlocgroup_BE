declare class EmailService {
    private transporter;
    constructor();
    sendVerificationEmail(email: string, token: string): Promise<void>;
    sendResetPasswordEmail(email: string, token: string): Promise<void>;
    sendWelcomeEmail(email: string, name: string): Promise<void>;
    sendNewsletterEmail(subscribers: string[], subject: string, content: string): Promise<void>;
    sendContactNotificationEmail(contactData: any): Promise<void>;
    testEmailSending(to: string, subject: string, content: string): Promise<any>;
}
export declare const emailService: EmailService;
export {};
//# sourceMappingURL=emailService.d.ts.map
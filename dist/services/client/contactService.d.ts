declare class ContactService {
    createContactMessage(messageData: any): Promise<any>;
    createConsultationRequest(requestData: any): Promise<any>;
    subscribeNewsletter(subscriberData: any): Promise<any>;
    unsubscribeNewsletter(email: string): Promise<boolean>;
    verifyNewsletterSubscription(token: string): Promise<boolean>;
}
export declare const contactService: ContactService;
export {};
//# sourceMappingURL=contactService.d.ts.map
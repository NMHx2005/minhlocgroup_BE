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
declare class ContactService {
    getContactMessages(page: number, limit: number, filters: ContactFilters): Promise<ContactListResult>;
    getContactMessageById(id: string): Promise<any>;
    createContactMessage(messageData: any): Promise<any>;
    updateContactMessage(id: string, updateData: any): Promise<any>;
    deleteContactMessage(id: string): Promise<boolean>;
    updateContactMessageStatus(id: string, status: string): Promise<any>;
    getNewsletterSubscribers(page: number, limit: number, filters: NewsletterFilters): Promise<NewsletterListResult>;
    createNewsletterSubscriber(subscriberData: any): Promise<any>;
    deleteNewsletterSubscriber(id: string): Promise<boolean>;
    getNewsletterCampaigns(page: number, limit: number, filters: any): Promise<any>;
    createNewsletterCampaign(campaignData: any): Promise<any>;
    sendNewsletterCampaign(id: string): Promise<any>;
    getConsultationRequests(page: number, limit: number, filters: ConsultationFilters): Promise<ConsultationListResult>;
    getConsultationRequestById(id: string): Promise<any>;
    createConsultationRequest(requestData: any): Promise<any>;
    updateConsultationRequest(id: string, updateData: any): Promise<any>;
    assignConsultationRequest(id: string, assignedTo: string): Promise<any>;
    updateConsultationRequestStatus(id: string, status: string): Promise<any>;
}
export declare const contactService: ContactService;
export {};
//# sourceMappingURL=contactService.d.ts.map
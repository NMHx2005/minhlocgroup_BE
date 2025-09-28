"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }
    async sendVerificationEmail(email, token) {
        try {
            const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
            const mailOptions = {
                from: process.env.SMTP_FROM || 'noreply@minhloc.com',
                to: email,
                subject: 'Xác thực email - MinhLoc Group',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Xác thực email</h2>
                        <p>Xin chào,</p>
                        <p>Cảm ơn bạn đã đăng ký tài khoản tại MinhLoc Group. Vui lòng click vào link bên dưới để xác thực email của bạn:</p>
                        <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Xác thực email</a>
                        <p>Link này sẽ hết hạn sau 24 giờ.</p>
                        <p>Trân trọng,<br>Đội ngũ MinhLoc Group</p>
                    </div>
                `
            };
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            throw new Error(`Lỗi khi gửi email xác thực: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async sendResetPasswordEmail(email, token) {
        try {
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
            const mailOptions = {
                from: process.env.SMTP_FROM || 'noreply@minhloc.com',
                to: email,
                subject: 'Khôi phục mật khẩu - MinhLoc Group',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Khôi phục mật khẩu</h2>
                        <p>Xin chào,</p>
                        <p>Bạn đã yêu cầu khôi phục mật khẩu. Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>
                        <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Đặt lại mật khẩu</a>
                        <p>Link này sẽ hết hạn sau 1 giờ.</p>
                        <p>Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.</p>
                        <p>Trân trọng,<br>Đội ngũ MinhLoc Group</p>
                    </div>
                `
            };
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            throw new Error(`Lỗi khi gửi email khôi phục mật khẩu: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async sendWelcomeEmail(email, name) {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM || 'noreply@minhloc.com',
                to: email,
                subject: 'Chào mừng đến với MinhLoc Group',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Chào mừng ${name}!</h2>
                        <p>Cảm ơn bạn đã đăng ký tài khoản tại MinhLoc Group. Chúng tôi rất vui được chào đón bạn!</p>
                        <p>Với tài khoản của bạn, bạn có thể:</p>
                        <ul>
                            <li>Xem các dự án bất động sản</li>
                            <li>Tìm hiểu về sản phẩm nhân sâm</li>
                            <li>Đọc tin tức mới nhất</li>
                            <li>Liên hệ tư vấn</li>
                        </ul>
                        <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>
                        <p>Trân trọng,<br>Đội ngũ MinhLoc Group</p>
                    </div>
                `
            };
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            throw new Error(`Lỗi khi gửi email chào mừng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async sendNewsletterEmail(subscribers, subject, content) {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM || 'noreply@minhloc.com',
                to: subscribers.join(','),
                subject: subject,
                html: content
            };
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            throw new Error(`Lỗi khi gửi email newsletter: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async sendContactNotificationEmail(contactData) {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM || 'noreply@minhloc.com',
                to: process.env.ADMIN_EMAIL || 'admin@minhloc.com',
                subject: 'Tin nhắn liên hệ mới - MinhLoc Group',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Tin nhắn liên hệ mới</h2>
                        <p><strong>Tên:</strong> ${contactData.name}</p>
                        <p><strong>Email:</strong> ${contactData.email}</p>
                        <p><strong>Số điện thoại:</strong> ${contactData.phone || 'N/A'}</p>
                        <p><strong>Chủ đề:</strong> ${contactData.subject}</p>
                        <p><strong>Nội dung:</strong></p>
                        <p>${contactData.message}</p>
                        <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
                    </div>
                `
            };
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            throw new Error(`Lỗi khi gửi email thông báo liên hệ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async testEmailSending(to, subject, content) {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM || 'noreply@minhloc.com',
                to: to,
                subject: subject,
                html: content
            };
            const result = await this.transporter.sendMail(mailOptions);
            return {
                messageId: result.messageId,
                response: result.response
            };
        }
        catch (error) {
            throw new Error(`Lỗi khi test gửi email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.emailService = new EmailService();
//# sourceMappingURL=emailService.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const JobPosition_1 = __importDefault(require("../models/core/JobPosition"));
const database_1 = require("../config/database");
const mongoose_2 = require("mongoose");
dotenv_1.default.config();
const seedCareers = async () => {
    await (0, database_1.connectDatabase)();
    console.log('🌱 Starting to seed careers data...');
    try {
        await JobPosition_1.default.deleteMany({});
        console.log('🗑️  Cleared existing job positions');
        const dummyUserId = new mongoose_2.Types.ObjectId();
        const jobPositions = [
            {
                title: 'Chuyên viên Kinh doanh Bất động sản',
                slug: 'chuyen-vien-kinh-doanh-bat-dong-san',
                department: 'sales',
                location: 'TP. Hồ Chí Minh',
                type: 'full-time',
                salary: '15-30 triệu VNĐ',
                experience: '1-3 năm',
                deadline: new Date('2025-12-31'),
                description: 'Tìm kiếm và tư vấn khách hàng về các sản phẩm bất động sản của công ty. Xây dựng mối quan hệ khách hàng và đạt chỉ tiêu kinh doanh. Làm việc trong môi trường năng động, chuyên nghiệp với cơ hội phát triển sự nghiệp rõ ràng.',
                requirements: [
                    'Tốt nghiệp Đại học các chuyên ngành liên quan',
                    'Có kinh nghiệm 1-3 năm trong lĩnh vực bất động sản',
                    'Kỹ năng giao tiếp và thuyết phục tốt',
                    'Có khả năng làm việc độc lập và theo nhóm',
                    'Thành thạo tin học văn phòng'
                ],
                benefits: [
                    'Lương cơ bản + hoa hồng hấp dẫn',
                    'Thưởng tháng 13, thưởng hiệu quả',
                    'Bảo hiểm xã hội, y tế đầy đủ',
                    'Du lịch công ty hàng năm',
                    'Đào tạo nâng cao chuyên môn'
                ],
                responsibilities: [
                    'Tìm kiếm và phát triển khách hàng tiềm năng',
                    'Tư vấn và giới thiệu sản phẩm bất động sản',
                    'Theo dõi và chăm sóc khách hàng',
                    'Báo cáo kết quả kinh doanh định kỳ'
                ],
                skills: ['Giao tiếp', 'Thuyết phục', 'Tin học văn phòng', 'Tiếng Anh'],
                isHot: true,
                isUrgent: false,
                isActive: true,
                status: 'published',
                priority: 8,
                tags: ['kinh doanh', 'bất động sản', 'tư vấn'],
                seoTitle: 'Tuyển dụng Chuyên viên Kinh doanh Bất động sản - MinhLoc Group',
                seoDescription: 'Cơ hội nghề nghiệp hấp dẫn cho vị trí Chuyên viên Kinh doanh Bất động sản tại MinhLoc Group. Lương cạnh tranh, môi trường làm việc chuyên nghiệp.',
                seoKeywords: ['tuyển dụng', 'kinh doanh', 'bất động sản', 'MinhLoc Group'],
                createdBy: dummyUserId,
                updatedBy: dummyUserId
            },
            {
                title: 'Kỹ sư Xây dựng',
                slug: 'ky-su-xay-dung',
                department: 'construction',
                location: 'TP. Hồ Chí Minh, Bình Dương',
                type: 'full-time',
                salary: '20-35 triệu VNĐ',
                experience: '2-5 năm',
                deadline: new Date('2025-12-31'),
                description: 'Tham gia thiết kế, giám sát thi công các dự án bất động sản. Đảm bảo chất lượng và tiến độ công trình. Làm việc với đội ngũ kỹ thuật chuyên nghiệp và có cơ hội thăng tiến cao.',
                requirements: [
                    'Tốt nghiệp Đại học chuyên ngành Xây dựng',
                    'Có kinh nghiệm 2-5 năm trong lĩnh vực xây dựng',
                    'Thành thạo AutoCAD, Revit, MS Project',
                    'Có chứng chỉ hành nghề xây dựng',
                    'Khả năng đọc hiểu bản vẽ kỹ thuật'
                ],
                benefits: [
                    'Lương thỏa thuận theo năng lực',
                    'Phụ cấp xăng xe, điện thoại',
                    'Bảo hiểm tai nạn 24/7',
                    'Cơ hội thăng tiến rõ ràng',
                    'Môi trường làm việc chuyên nghiệp'
                ],
                responsibilities: [
                    'Thiết kế và lập dự toán công trình',
                    'Giám sát thi công tại công trường',
                    'Kiểm tra chất lượng vật liệu và thi công',
                    'Báo cáo tiến độ và chất lượng công trình'
                ],
                skills: ['AutoCAD', 'Revit', 'MS Project', 'Quản lý dự án', 'Kỹ thuật xây dựng'],
                isHot: false,
                isUrgent: true,
                isActive: true,
                status: 'published',
                priority: 9,
                tags: ['kỹ thuật', 'xây dựng', 'giám sát'],
                seoTitle: 'Tuyển dụng Kỹ sư Xây dựng - MinhLoc Group',
                seoDescription: 'Tuyển dụng Kỹ sư Xây dựng có kinh nghiệm tại MinhLoc Group. Lương cao, phúc lợi tốt, cơ hội phát triển sự nghiệp.',
                seoKeywords: ['tuyển dụng', 'kỹ sư', 'xây dựng', 'MinhLoc Group'],
                createdBy: dummyUserId,
                updatedBy: dummyUserId
            },
            {
                title: 'Chuyên viên Marketing Digital',
                slug: 'chuyen-vien-marketing-digital',
                department: 'marketing',
                location: 'TP. Hồ Chí Minh',
                type: 'full-time',
                salary: '12-20 triệu VNĐ',
                experience: '1-2 năm',
                deadline: new Date('2025-12-31'),
                description: 'Phát triển và thực hiện các chiến lược marketing online. Quản lý các kênh truyền thông xã hội và website. Làm việc trong môi trường sáng tạo, năng động với nhiều cơ hội học hỏi.',
                requirements: [
                    'Tốt nghiệp Đại học Marketing, Truyền thông',
                    'Có kinh nghiệm với Google Ads, Facebook Ads',
                    'Kỹ năng viết content và thiết kế cơ bản',
                    'Hiểu biết về SEO, SEM',
                    'Sáng tạo và cập nhật xu hướng'
                ],
                benefits: [
                    'Lương cạnh tranh + KPI',
                    'Được đào tạo các khóa học marketing',
                    'Môi trường năng động, sáng tạo',
                    'Cơ hội học hỏi từ chuyên gia',
                    'Team building định kỳ'
                ],
                responsibilities: [
                    'Phát triển chiến lược marketing digital',
                    'Quản lý các kênh social media',
                    'Tạo nội dung và chạy quảng cáo online',
                    'Phân tích và báo cáo hiệu quả marketing'
                ],
                skills: ['Google Ads', 'Facebook Ads', 'SEO', 'Content Marketing', 'Analytics'],
                isHot: true,
                isUrgent: false,
                isActive: true,
                status: 'published',
                priority: 7,
                tags: ['marketing', 'digital', 'social media'],
                seoTitle: 'Tuyển dụng Chuyên viên Marketing Digital - MinhLoc Group',
                seoDescription: 'Cơ hội nghề nghiệp cho Chuyên viên Marketing Digital tại MinhLoc Group. Môi trường sáng tạo, lương cạnh tranh.',
                seoKeywords: ['tuyển dụng', 'marketing', 'digital', 'MinhLoc Group'],
                createdBy: dummyUserId,
                updatedBy: dummyUserId
            },
            {
                title: 'Kế toán Tổng hợp',
                slug: 'ke-toan-tong-hop',
                department: 'finance',
                location: 'TP. Hồ Chí Minh',
                type: 'full-time',
                salary: '10-15 triệu VNĐ',
                experience: 'Từ 1 năm',
                deadline: new Date('2025-12-31'),
                description: 'Thực hiện công tác kế toán tổng hợp, lập báo cáo tài chính, quản lý thu chi và ngân sách công ty. Làm việc trong môi trường ổn định, chuyên nghiệp.',
                requirements: [
                    'Tốt nghiệp Đại học Kế toán, Tài chính',
                    'Có chứng chỉ kế toán trưởng (ưu tiên)',
                    'Thành thạo Excel, phần mềm kế toán',
                    'Hiểu biết về luật thuế và kế toán',
                    'Tỉ mỉ, cẩn thận, trung thực'
                ],
                benefits: [
                    'Lương ổn định theo bậc lương',
                    'Làm việc giờ hành chính',
                    'Bảo hiểm đầy đủ theo quy định',
                    'Môi trường làm việc ổn định',
                    'Cơ hội học tập nâng cao'
                ],
                responsibilities: [
                    'Lập báo cáo tài chính hàng tháng',
                    'Quản lý sổ sách kế toán',
                    'Theo dõi thu chi và ngân sách',
                    'Làm việc với cơ quan thuế'
                ],
                skills: ['Kế toán', 'Excel', 'Phần mềm kế toán', 'Luật thuế'],
                isHot: false,
                isUrgent: false,
                isActive: true,
                status: 'published',
                priority: 5,
                tags: ['kế toán', 'tài chính', 'báo cáo'],
                seoTitle: 'Tuyển dụng Kế toán Tổng hợp - MinhLoc Group',
                seoDescription: 'Tuyển dụng Kế toán Tổng hợp tại MinhLoc Group. Môi trường ổn định, lương cạnh tranh, phúc lợi tốt.',
                seoKeywords: ['tuyển dụng', 'kế toán', 'tài chính', 'MinhLoc Group'],
                createdBy: dummyUserId,
                updatedBy: dummyUserId
            },
            {
                title: 'Thực tập sinh Marketing',
                slug: 'thuc-tap-sinh-marketing',
                department: 'marketing',
                location: 'TP. Hồ Chí Minh',
                type: 'internship',
                salary: '3-5 triệu VNĐ',
                experience: 'Không yêu cầu',
                deadline: new Date('2025-12-31'),
                description: 'Hỗ trợ team marketing trong các hoạt động truyền thông, sự kiện và nghiên cứu thị trường. Cơ hội học hỏi và phát triển kỹ năng trong môi trường chuyên nghiệp.',
                requirements: [
                    'Sinh viên năm 3, 4 hoặc mới tốt nghiệp',
                    'Chuyên ngành Marketing, Kinh tế, Truyền thông',
                    'Có kiến thức cơ bản về marketing',
                    'Kỹ năng tin học văn phòng',
                    'Nhiệt tình, học hỏi'
                ],
                benefits: [
                    'Trợ cấp thực tập hấp dẫn',
                    'Được đào tạo bài bản',
                    'Cơ hội trở thành nhân viên chính thức',
                    'Môi trường học tập tốt',
                    'Chế độ nghỉ phép linh hoạt'
                ],
                responsibilities: [
                    'Hỗ trợ các hoạt động marketing',
                    'Nghiên cứu thị trường và đối thủ',
                    'Tạo nội dung cho social media',
                    'Hỗ trợ tổ chức sự kiện'
                ],
                skills: ['Marketing cơ bản', 'Tin học văn phòng', 'Sáng tạo', 'Giao tiếp'],
                isHot: false,
                isUrgent: false,
                isActive: true,
                status: 'published',
                priority: 3,
                tags: ['thực tập', 'marketing', 'học hỏi'],
                seoTitle: 'Tuyển dụng Thực tập sinh Marketing - MinhLoc Group',
                seoDescription: 'Cơ hội thực tập Marketing tại MinhLoc Group. Được đào tạo bài bản, cơ hội trở thành nhân viên chính thức.',
                seoKeywords: ['thực tập', 'marketing', 'MinhLoc Group', 'học hỏi'],
                createdBy: dummyUserId,
                updatedBy: dummyUserId
            },
            {
                title: 'Trưởng phòng Nhân sự',
                slug: 'truong-phong-nhan-su',
                department: 'hr',
                location: 'TP. Hồ Chí Minh',
                type: 'full-time',
                salary: '25-40 triệu VNĐ',
                experience: '5+ năm',
                deadline: new Date('2025-12-31'),
                description: 'Quản lý toàn bộ hoạt động nhân sự, xây dựng chính sách nhân sự, tuyển dụng và phát triển nhân tài. Vị trí lãnh đạo với quyền hạn và trách nhiệm cao.',
                requirements: [
                    'Tốt nghiệp Đại học chuyên ngành Nhân sự, Tâm lý',
                    'Có kinh nghiệm 5+ năm ở vị trí quản lý HR',
                    'Kỹ năng lãnh đạo và quản lý nhóm',
                    'Hiểu biết về luật lao động',
                    'Khả năng lập kế hoạch chiến lược'
                ],
                benefits: [
                    'Lương cao + thưởng quản lý',
                    'Quyền ký quyết định nhân sự',
                    'Cơ hội phát triển sự nghiệp cao',
                    'Đào tạo lãnh đạo cao cấp',
                    'Phụ cấp xe xăng, điện thoại'
                ],
                responsibilities: [
                    'Xây dựng chính sách nhân sự',
                    'Tuyển dụng và phát triển nhân tài',
                    'Quản lý quan hệ lao động',
                    'Lập kế hoạch đào tạo nhân viên'
                ],
                skills: ['Quản lý nhân sự', 'Lãnh đạo', 'Luật lao động', 'Chiến lược'],
                isHot: true,
                isUrgent: true,
                isActive: true,
                status: 'published',
                priority: 10,
                tags: ['quản lý', 'nhân sự', 'lãnh đạo'],
                seoTitle: 'Tuyển dụng Trưởng phòng Nhân sự - MinhLoc Group',
                seoDescription: 'Cơ hội nghề nghiệp cao cấp cho vị trí Trưởng phòng Nhân sự tại MinhLoc Group. Lương cao, quyền hạn lớn.',
                seoKeywords: ['tuyển dụng', 'trưởng phòng', 'nhân sự', 'MinhLoc Group'],
                createdBy: dummyUserId,
                updatedBy: dummyUserId
            }
        ];
        await JobPosition_1.default.insertMany(jobPositions);
        console.log(`✅ Created ${jobPositions.length} job positions`);
        jobPositions.forEach(job => {
            console.log(`   - ${job.title} (${job.department})`);
        });
        console.log('🎉 Careers seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Error seeding careers:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('📦 Database connection closed');
    }
};
seedCareers();
//# sourceMappingURL=seedCareers.js.map
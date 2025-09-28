"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("../config/database");
const core_1 = require("../models/core");
const sampleRoles = [
    {
        name: 'super_admin',
        displayName: 'Super Admin',
        description: 'Toàn quyền hệ thống',
        permissions: ['all_permissions'],
        isActive: true
    },
    {
        name: 'admin',
        displayName: 'Admin',
        description: 'Quản trị viên',
        permissions: ['users_read', 'users_manage', 'projects_read', 'projects_manage', 'products_read', 'products_manage'],
        isActive: true
    },
    {
        name: 'editor',
        displayName: 'Editor',
        description: 'Biên tập viên',
        permissions: ['news_read', 'news_manage', 'settings_read'],
        isActive: true
    },
    {
        name: 'user',
        displayName: 'Người dùng',
        description: 'Người dùng thông thường',
        permissions: ['contacts_read'],
        isActive: true
    }
];
const samplePermissions = [
    { name: 'all_permissions', displayName: 'Toàn quyền', description: 'Toàn quyền hệ thống', module: 'system', action: 'manage', isActive: true },
    { name: 'users_read', displayName: 'Xem người dùng', description: 'Xem danh sách người dùng', module: 'users', action: 'read', isActive: true },
    { name: 'users_manage', displayName: 'Quản lý người dùng', description: 'Thêm/sửa/xóa người dùng', module: 'users', action: 'manage', isActive: true },
    { name: 'projects_read', displayName: 'Xem dự án', description: 'Xem danh sách dự án', module: 'projects', action: 'read', isActive: true },
    { name: 'projects_manage', displayName: 'Quản lý dự án', description: 'Thêm/sửa/xóa dự án', module: 'projects', action: 'manage', isActive: true },
    { name: 'products_read', displayName: 'Xem sản phẩm', description: 'Xem danh sách sản phẩm', module: 'products', action: 'read', isActive: true },
    { name: 'products_manage', displayName: 'Quản lý sản phẩm', description: 'Thêm/sửa/xóa sản phẩm', module: 'products', action: 'manage', isActive: true },
    { name: 'news_read', displayName: 'Xem tin tức', description: 'Xem danh sách tin tức', module: 'news', action: 'read', isActive: true },
    { name: 'news_manage', displayName: 'Quản lý tin tức', description: 'Thêm/sửa/xóa tin tức', module: 'news', action: 'manage', isActive: true },
    { name: 'settings_read', displayName: 'Xem cài đặt', description: 'Xem cài đặt hệ thống', module: 'settings', action: 'read', isActive: true },
    { name: 'settings_manage', displayName: 'Quản lý cài đặt', description: 'Thêm/sửa/xóa cài đặt', module: 'settings', action: 'manage', isActive: true },
    { name: 'contacts_read', displayName: 'Xem liên hệ', description: 'Xem tin nhắn liên hệ', module: 'contacts', action: 'read', isActive: true },
    { name: 'contacts_manage', displayName: 'Quản lý liên hệ', description: 'Quản lý tin nhắn liên hệ', module: 'contacts', action: 'manage', isActive: true }
];
const sampleGinsengCategories = [
    {
        name: 'Nhân sâm Hàn Quốc',
        slug: 'nhan-sam-han-quoc',
        description: 'Các loại nhân sâm cao cấp từ Hàn Quốc',
        image: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF.jpg',
        sortOrder: 1,
        isFeatured: true,
        isActive: true
    },
    {
        name: 'Nhân sâm Việt Nam',
        slug: 'nhan-sam-viet-nam',
        description: 'Nhân sâm chất lượng cao từ Việt Nam',
        image: 'https://via.placeholder.com/300x200/2196F3/FFFFFF.jpg',
        sortOrder: 2,
        isFeatured: true,
        isActive: true
    }
];
const sampleGinsengOrigins = [
    {
        name: 'Hàn Quốc',
        slug: 'han-quoc',
        country: 'South Korea',
        region: 'Gyeonggi, Gangwon',
        description: 'Vùng trồng nhân sâm nổi tiếng nhất thế giới',
        flagImage: 'https://via.placeholder.com/64x48/4CAF50/FFFFFF.png',
        isFeatured: true,
        isActive: true
    },
    {
        name: 'Việt Nam',
        slug: 'viet-nam',
        country: 'Vietnam',
        region: 'Kon Tum, Gia Lai',
        description: 'Nhân sâm chất lượng cao từ vùng Tây Nguyên',
        flagImage: 'https://via.placeholder.com/64x48/2196F3/FFFFFF.png',
        isFeatured: true,
        isActive: true
    }
];
const sampleNewsCategories = [
    {
        name: 'Tin MinhLoc Group',
        slug: 'tin-minhloc-group',
        description: 'Tin tức về MinhLoc Group',
        color: '#1976d2',
        isActive: true
    },
    {
        name: 'Tin thị trường',
        slug: 'tin-thi-truong',
        description: 'Tin tức thị trường bất động sản và nhân sâm',
        color: '#388e3c',
        isActive: true
    }
];
const sampleProjects = [
    {
        name: 'Khu đô thị MinhLoc City',
        slug: 'khu-do-thi-minhloc-city',
        description: 'Khu đô thị hiện đại với đầy đủ tiện ích',
        content: 'Khu đô thị MinhLoc City là dự án bất động sản cao cấp với 500 căn hộ, được thiết kế hiện đại và đầy đủ tiện ích. Dự án nằm tại Quận 7, TP.HCM với vị trí đắc địa gần sông.',
        type: 'apartment',
        status: 'construction',
        location: 'Quận 7, TP.HCM',
        coordinates: { latitude: 10.7322, longitude: 106.7229 },
        price: { min: 2500000000, max: 5000000000, currency: 'VND' },
        area: { min: 50, max: 120, unit: 'm2' },
        images: ['https://via.placeholder.com/800x600/4CAF50/FFFFFF.jpg', 'https://via.placeholder.com/800x600/4CAF50/FFFFFF.jpg'],
        features: ['Căn hộ cao cấp', 'Nội thất sang trọng', 'View sông đẹp'],
        amenities: ['Hồ bơi', 'Gym', 'Công viên', 'Trường học', 'Bệnh viện'],
        developer: 'MinhLoc Group',
        completionDate: new Date('2025-12-31'),
        totalUnits: 500,
        soldUnits: 150,
        revenue: 375000000000,
        isFeatured: true,
        isActive: true,
        tags: ['căn hộ', 'quận 7', 'tiện ích'],
        seoTitle: 'Khu đô thị MinhLoc City Quận 7 - Căn hộ cao cấp',
        seoDescription: 'Khu đô thị MinhLoc City với căn hộ cao cấp, đầy đủ tiện ích tại Quận 7',
        seoKeywords: ['căn hộ quận 7', 'minhloc city', 'bất động sản']
    },
    {
        name: 'Biệt thự MinhLoc Villa',
        slug: 'biet-thu-minhloc-villa',
        description: 'Biệt thự cao cấp với không gian xanh',
        content: 'Biệt thự MinhLoc Villa mang đến không gian sống lý tưởng với thiết kế hiện đại và không gian xanh. Dự án nằm tại Quận 2, TP.HCM với 50 biệt thự cao cấp.',
        type: 'villa',
        status: 'completed',
        location: 'Quận 2, TP.HCM',
        coordinates: { latitude: 10.7879, longitude: 106.7498 },
        price: { min: 8000000000, max: 15000000000, currency: 'VND' },
        area: { min: 200, max: 500, unit: 'm2' },
        images: ['https://via.placeholder.com/800x600/FF9800/FFFFFF.jpg', 'https://via.placeholder.com/800x600/FF9800/FFFFFF.jpg'],
        features: ['Biệt thự sang trọng', 'Thiết kế hiện đại', 'Vị trí đắc địa'],
        amenities: ['Hồ bơi riêng', 'Sân vườn', 'Garage', 'Bảo vệ 24/7'],
        developer: 'MinhLoc Group',
        completionDate: new Date('2024-12-31'),
        totalUnits: 50,
        soldUnits: 12,
        revenue: 96000000000,
        isFeatured: true,
        isActive: true,
        tags: ['biệt thự', 'quận 2', 'cao cấp'],
        seoTitle: 'Biệt thự MinhLoc Villa Quận 2 - Biệt thự cao cấp',
        seoDescription: 'Biệt thự MinhLoc Villa với không gian xanh, tiện ích cao cấp tại Quận 2',
        seoKeywords: ['biệt thự quận 2', 'minhloc villa', 'bất động sản cao cấp']
    }
];
const sampleGinsengProducts = [
    {
        name: 'Nhân sâm Hàn Quốc 6 năm tuổi',
        slug: 'nhan-sam-han-quoc-6-nam-tuoi',
        description: 'Nhân sâm Hàn Quốc chất lượng cao, 6 năm tuổi',
        content: 'Nhân sâm Hàn Quốc 6 năm tuổi được trồng tại vùng Gyeonggi, Gangwon - vùng trồng nhân sâm nổi tiếng nhất thế giới. Sản phẩm có chất lượng cao với hàm lượng saponin cao.',
        grade: 'premium',
        weight: 50,
        price: 2500000,
        stock: 100,
        status: 'active',
        images: ['https://via.placeholder.com/400x300/korean-ginseng-6yr-1.jpg', 'https://via.placeholder.com/400x300/korean-ginseng-6yr-2.jpg'],
        features: ['Xuất xứ Hàn Quốc', '6 năm tuổi', 'Chất lượng cao'],
        specifications: {
            age: 6,
            processingMethod: 'Sấy khô tự nhiên',
            storageMethod: 'Bảo quản nơi khô ráo, thoáng mát',
            ingredients: ['Nhân sâm Hàn Quốc 100%'],
            benefits: ['Tăng cường sức khỏe', 'Bồi bổ cơ thể', 'Tăng sức đề kháng'],
            usageInstructions: 'Ngâm với nước ấm 5-10 phút, uống 1-2 lần/ngày',
            contraindications: 'Không dùng cho phụ nữ có thai, trẻ em dưới 12 tuổi'
        },
        isFeatured: true,
        isActive: true,
        tags: ['nhân sâm', 'hàn quốc', '6 năm tuổi'],
        sku: 'GIN-KR-6YR-001',
        weightUnit: 'g',
        seoTitle: 'Nhân sâm Hàn Quốc 6 năm tuổi - Chất lượng cao',
        seoDescription: 'Nhân sâm Hàn Quốc 6 năm tuổi chất lượng cao, xuất xứ chính hãng',
        seoKeywords: ['nhân sâm hàn quốc', '6 năm tuổi', 'chất lượng cao']
    },
    {
        name: 'Nhân sâm Việt Nam 4 năm tuổi',
        slug: 'nhan-sam-viet-nam-4-nam-tuoi',
        description: 'Nhân sâm Việt Nam chất lượng tốt, 4 năm tuổi',
        content: 'Nhân sâm Việt Nam 4 năm tuổi được trồng tại vùng Tây Nguyên với khí hậu và đất đai phù hợp. Sản phẩm có chất lượng tốt và giá cả hợp lý.',
        grade: 'standard',
        weight: 30,
        price: 1200000,
        stock: 150,
        status: 'active',
        images: ['https://via.placeholder.com/400x300/vietnamese-ginseng-4yr-1.jpg'],
        features: ['Xuất xứ Việt Nam', '4 năm tuổi', 'Giá hợp lý'],
        specifications: {
            age: 4,
            processingMethod: 'Sấy khô',
            storageMethod: 'Bảo quản nơi khô ráo',
            ingredients: ['Nhân sâm Việt Nam 100%'],
            benefits: ['Bồi bổ cơ thể', 'Tăng sức đề kháng'],
            usageInstructions: 'Ngâm với nước ấm, uống 1 lần/ngày',
            contraindications: 'Không dùng cho phụ nữ có thai'
        },
        isFeatured: false,
        isActive: true,
        tags: ['nhân sâm', 'việt nam', '4 năm tuổi'],
        sku: 'GIN-VN-4YR-002',
        weightUnit: 'g',
        seoTitle: 'Nhân sâm Việt Nam 4 năm tuổi - Chất lượng tốt',
        seoDescription: 'Nhân sâm Việt Nam 4 năm tuổi chất lượng tốt, giá hợp lý',
        seoKeywords: ['nhân sâm việt nam', '4 năm tuổi', 'giá hợp lý']
    }
];
const sampleNewsArticles = [
    {
        title: 'MinhLoc Group khởi công dự án khu đô thị mới',
        slug: 'minhloc-group-khoi-cong-du-an-khu-do-thi-moi',
        excerpt: 'MinhLoc Group vừa khởi công dự án khu đô thị MinhLoc City tại Quận 7',
        content: 'Ngày 15/3/2024, MinhLoc Group đã tổ chức lễ khởi công dự án khu đô thị MinhLoc City tại Quận 7, TP.HCM. Đây là dự án bất động sản cao cấp với 500 căn hộ, được thiết kế hiện đại và đầy đủ tiện ích. Dự án dự kiến hoàn thành vào cuối năm 2025, mang đến không gian sống lý tưởng cho cư dân tại khu vực phía Nam thành phố.',
        status: 'published',
        publishedAt: new Date('2024-03-15'),
        featuredImage: 'https://via.placeholder.com/800x400/minhloc-city-groundbreaking.jpg',
        tags: ['bất động sản', 'khởi công', 'quận 7'],
        statistics: {
            views: 1250,
            likes: 45,
            shares: 12,
            comments: 8
        },
        isFeatured: true,
        isBreaking: false,
        allowComments: true,
        readingTime: 5,
        wordCount: 800,
        seoTitle: 'MinhLoc Group khởi công dự án khu đô thị mới tại Quận 7',
        seoDescription: 'MinhLoc Group khởi công dự án khu đô thị MinhLoc City với 500 căn hộ cao cấp',
        seoKeywords: ['minhloc group', 'khu đô thị', 'quận 7', 'dự án mới']
    },
    {
        title: 'Thị trường bất động sản TP.HCM tăng trưởng mạnh',
        slug: 'thi-truong-bat-dong-san-tphcm-tang-truong-manh',
        excerpt: 'Thị trường bất động sản TP.HCM ghi nhận sự tăng trưởng mạnh mẽ trong quý 1/2024',
        content: 'Theo báo cáo mới nhất, thị trường bất động sản TP.HCM đã ghi nhận sự tăng trưởng mạnh mẽ trong quý 1/2024. Với nhiều dự án mới được khởi công và hoàn thành, thị trường bất động sản tại thành phố lớn nhất Việt Nam đang cho thấy những dấu hiệu tích cực. Các chuyên gia dự đoán xu hướng này sẽ tiếp tục trong các quý tiếp theo.',
        status: 'published',
        featuredImage: 'https://via.placeholder.com/800x400/real-estate-market.jpg',
        images: ['https://via.placeholder.com/800x400/real-estate-market.jpg'],
        tags: ['thị trường', 'bất động sản', 'tphcm'],
        statistics: {
            views: 980,
            likes: 32,
            shares: 8,
            comments: 5
        },
        isFeatured: false,
        isBreaking: false,
        allowComments: true,
        readingTime: 8,
        wordCount: 650,
        seoTitle: 'Thị trường bất động sản TP.HCM tăng trưởng mạnh quý 1/2024',
        seoDescription: 'Thị trường bất động sản TP.HCM ghi nhận sự tăng trưởng mạnh mẽ với nhiều dự án mới',
        seoKeywords: ['thị trường bất động sản', 'tphcm', 'tăng trưởng', 'quý 1/2024']
    }
];
const sampleContactMessages = [
    {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '901234567',
        subject: 'Tư vấn mua căn hộ',
        message: 'Tôi muốn tư vấn về dự án khu đô thị MinhLoc City',
        status: 'new',
        source: 'website',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
        name: 'Trần Thị B',
        email: 'tranthib@email.com',
        phone: '907654321',
        subject: 'Hỏi về sản phẩm nhân sâm',
        message: 'Tôi muốn hỏi về sản phẩm nhân sâm Hàn Quốc 6 năm tuổi',
        status: 'in_progress',
        source: 'website',
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
];
const sampleCompanyInfo = [
    {
        section: 'general',
        title: 'Thông tin chung về MinhLoc Group',
        content: 'MinhLoc Group là tập đoàn đa ngành hàng đầu Việt Nam, hoạt động trong các lĩnh vực bất động sản, đầu tư tài chính và kinh doanh nhân sâm cao cấp. Với slogan "Xây dựng tương lai, phát triển bền vững", chúng tôi cam kết mang đến những giá trị tốt nhất cho khách hàng và cộng đồng.',
        images: ['https://via.placeholder.com/200x100/logo.png']
    },
    {
        section: 'history',
        title: 'Lịch sử phát triển',
        content: 'MinhLoc Group được thành lập năm 2010 với tầm nhìn trở thành tập đoàn đa ngành hàng đầu Việt Nam. Năm 2015, chúng tôi mở rộng sang lĩnh vực bất động sản với dự án đầu tiên tại TP.HCM. Năm 2020, chúng tôi phát triển kinh doanh nhân sâm cao cấp từ Hàn Quốc.',
        data: {
            milestones: [
                {
                    year: '2010',
                    event: 'Thành lập công ty',
                    description: 'MinhLoc Group được thành lập với tầm nhìn trở thành tập đoàn đa ngành hàng đầu Việt Nam'
                },
                {
                    year: '2015',
                    event: 'Mở rộng sang bất động sản',
                    description: 'Bắt đầu đầu tư vào lĩnh vực bất động sản với dự án đầu tiên tại TP.HCM'
                },
                {
                    year: '2020',
                    event: 'Phát triển kinh doanh nhân sâm',
                    description: 'Mở rộng hoạt động kinh doanh nhân sâm cao cấp từ Hàn Quốc'
                }
            ]
        }
    }
];
async function seedDatabase() {
    try {
        await (0, database_1.connectDatabase)();
        console.log('🌱 Starting database seeding...');
        await Promise.all([
            core_1.User.deleteMany({}),
            core_1.Role.deleteMany({}),
            core_1.Permission.deleteMany({}),
            core_1.Project.deleteMany({}),
            core_1.GinsengProduct.deleteMany({}),
            core_1.GinsengCategory.deleteMany({}),
            core_1.GinsengOrigin.deleteMany({}),
            core_1.NewsCategory.deleteMany({}),
            core_1.NewsArticle.deleteMany({}),
            core_1.ContactMessage.deleteMany({}),
            core_1.CompanyInfo.deleteMany({})
        ]);
        console.log('🗑️ Cleared existing data');
        await core_1.Permission.insertMany(samplePermissions);
        console.log('✅ Created permissions');
        await core_1.Role.insertMany(sampleRoles);
        console.log('✅ Created roles');
        const adminUser = new core_1.User({
            name: 'Admin MinhLoc',
            email: 'admin@minhlocgroup.com',
            password: 'admin123',
            phone: '901234567',
            role: 'admin',
            status: 'active',
            emailVerified: true
        });
        await adminUser.save();
        console.log('✅ Created admin user');
        const createdGinsengCategories = await core_1.GinsengCategory.insertMany(sampleGinsengCategories);
        console.log('✅ Created ginseng categories');
        const createdGinsengOrigins = await core_1.GinsengOrigin.insertMany(sampleGinsengOrigins);
        console.log('✅ Created ginseng origins');
        const createdNewsCategories = await core_1.NewsCategory.insertMany(sampleNewsCategories);
        console.log('✅ Created news categories');
        const projectsWithRefs = sampleProjects.map(project => ({
            ...project,
            createdBy: adminUser._id,
            updatedBy: adminUser._id
        }));
        const createdProjects = await core_1.Project.insertMany(projectsWithRefs);
        console.log('✅ Created projects');
        const ginsengProductsWithRefs = sampleGinsengProducts.map((product, index) => ({
            ...product,
            categoryId: createdGinsengCategories[index % createdGinsengCategories.length]?._id || createdGinsengCategories[0]?._id,
            originId: createdGinsengOrigins[index % createdGinsengOrigins.length]?._id || createdGinsengOrigins[0]?._id,
            createdBy: adminUser._id,
            updatedBy: adminUser._id
        }));
        const createdGinsengProducts = await core_1.GinsengProduct.insertMany(ginsengProductsWithRefs);
        console.log('✅ Created ginseng products');
        const newsArticlesWithRefs = sampleNewsArticles.map((article, index) => ({
            ...article,
            categoryId: createdNewsCategories[index % createdNewsCategories.length]?._id || createdNewsCategories[0]?._id,
            author: {
                id: adminUser._id,
                name: adminUser.name
            },
            seo: {
                metaTitle: article.seoTitle,
                metaDescription: article.seoDescription,
                keywords: article.seoKeywords
            }
        }));
        const createdNewsArticles = await core_1.NewsArticle.insertMany(newsArticlesWithRefs);
        console.log('✅ Created news articles');
        await core_1.ContactMessage.insertMany(sampleContactMessages);
        console.log('✅ Created contact messages');
        const companyInfoWithRefs = sampleCompanyInfo.map(info => ({
            ...info,
            createdBy: adminUser._id,
            updatedBy: adminUser._id
        }));
        await core_1.CompanyInfo.insertMany(companyInfoWithRefs);
        console.log('✅ Created company info');
        console.log('🎉 Database seeding completed successfully!');
        console.log(`📊 Summary:`);
        console.log(`   - Users: 1`);
        console.log(`   - Roles: ${sampleRoles.length}`);
        console.log(`   - Permissions: ${samplePermissions.length}`);
        console.log(`   - Projects: ${sampleProjects.length}`);
        console.log(`   - Ginseng Products: ${sampleGinsengProducts.length}`);
        console.log(`   - Ginseng Categories: ${sampleGinsengCategories.length}`);
        console.log(`   - Ginseng Origins: ${sampleGinsengOrigins.length}`);
        console.log(`   - News Articles: ${sampleNewsArticles.length}`);
        console.log(`   - News Categories: ${sampleNewsCategories.length}`);
        console.log(`   - Contact Messages: ${sampleContactMessages.length}`);
        console.log(`   - Company Info: ${sampleCompanyInfo.length}`);
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('🔌 Disconnected from database');
    }
}
if (require.main === module) {
    seedDatabase()
        .then(() => {
        console.log('✅ Seeding completed successfully');
        process.exit(0);
    })
        .catch((error) => {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    });
}
exports.default = seedDatabase;
//# sourceMappingURL=seedData.js.map
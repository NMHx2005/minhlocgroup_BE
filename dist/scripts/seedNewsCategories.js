"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NewsCategory_1 = __importDefault(require("../models/core/NewsCategory"));
const database_1 = require("../config/database");
const seedNewsCategories = async () => {
    try {
        await (0, database_1.connectDatabase)();
        console.log('🌱 Starting to seed news categories...');
        await NewsCategory_1.default.deleteMany({});
        console.log('🗑️  Cleared existing news categories');
        const categories = [
            {
                name: 'Tin MinhLoc Group',
                slug: 'tin-minhloc-group',
                description: 'Tin tức về hoạt động và phát triển của MinhLoc Group',
                color: '#1976d2',
                isActive: true,
                sortOrder: 1
            },
            {
                name: 'Bất động sản',
                slug: 'bat-dong-san',
                description: 'Tin tức về thị trường bất động sản và các dự án',
                color: '#2e7d32',
                isActive: true,
                sortOrder: 2
            },
            {
                name: 'Nhân sâm cao cấp',
                slug: 'nhan-sam-cao-cap',
                description: 'Tin tức về sản phẩm nhân sâm và chăm sóc sức khỏe',
                color: '#d32f2f',
                isActive: true,
                sortOrder: 3
            },
            {
                name: 'Thị trường',
                slug: 'thi-truong',
                description: 'Phân tích và cập nhật thị trường bất động sản',
                color: '#f57c00',
                isActive: true,
                sortOrder: 4
            },
            {
                name: 'Pháp lý',
                slug: 'phap-ly',
                description: 'Tin tức về quy định pháp luật liên quan đến bất động sản',
                color: '#7b1fa2',
                isActive: true,
                sortOrder: 5
            },
            {
                name: 'Tuyển dụng',
                slug: 'tuyen-dung',
                description: 'Thông tin tuyển dụng và cơ hội nghề nghiệp tại MinhLoc Group',
                color: '#388e3c',
                isActive: true,
                sortOrder: 6
            }
        ];
        const createdCategories = await NewsCategory_1.default.insertMany(categories);
        console.log(`✅ Created ${createdCategories.length} news categories`);
        createdCategories.forEach(category => {
            console.log(`   - ${category.name} (${category.slug})`);
        });
        console.log('🎉 News categories seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Error seeding news categories:', error);
    }
    finally {
        await mongoose_1.default.connection.close();
        console.log('📦 Database connection closed');
        process.exit(0);
    }
};
if (require.main === module) {
    seedNewsCategories();
}
exports.default = seedNewsCategories;

import mongoose from 'mongoose';
import NewsCategory from '../models/core/NewsCategory';
import { connectDatabase } from '../config/database';

const seedNewsCategories = async () => {
    try {
        // Connect to database
        await connectDatabase();

        console.log('🌱 Starting to seed news categories...');

        // Clear existing categories
        await NewsCategory.deleteMany({});
        console.log('🗑️  Cleared existing news categories');

        // Create default categories
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

        // Insert categories
        const createdCategories = await NewsCategory.insertMany(categories);
        console.log(`✅ Created ${createdCategories.length} news categories`);

        // Display created categories
        createdCategories.forEach(category => {
            console.log(`   - ${category.name} (${category.slug})`);
        });

        console.log('🎉 News categories seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding news categories:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('📦 Database connection closed');
        process.exit(0);
    }
};

// Run the seeding function
if (require.main === module) {
    seedNewsCategories();
}

export default seedNewsCategories;

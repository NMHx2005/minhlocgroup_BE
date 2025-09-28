import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import CompanyInfo from '../models/core/CompanyInfo';
import { companyInfoSeedData } from '../data/companyInfoSeed';

const seedCompanyInfo = async () => {
    try {
        console.log('🌱 Starting Company Info seeding...');

        // Connect to database
        await connectDatabase();

        // Clear existing data
        await CompanyInfo.deleteMany({});
        console.log('✅ Cleared existing company info data');

        // Insert seed data
        const insertedData = await CompanyInfo.insertMany(companyInfoSeedData);
        console.log(`✅ Inserted ${insertedData.length} company info records`);

        // Display summary
        console.log('\n📊 Company Info Summary:');
        for (const item of insertedData) {
            console.log(`- ${item.section}: ${item.title}`);
        }

        console.log('\n🎉 Company Info seeding completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding company info:', error);
        process.exit(1);
    }
};

// Run the seeding
seedCompanyInfo();

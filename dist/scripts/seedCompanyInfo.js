"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const CompanyInfo_1 = __importDefault(require("../models/core/CompanyInfo"));
const companyInfoSeed_1 = require("../data/companyInfoSeed");
const seedCompanyInfo = async () => {
    try {
        console.log('🌱 Starting Company Info seeding...');
        await (0, database_1.connectDatabase)();
        await CompanyInfo_1.default.deleteMany({});
        console.log('✅ Cleared existing company info data');
        const insertedData = await CompanyInfo_1.default.insertMany(companyInfoSeed_1.companyInfoSeedData);
        console.log(`✅ Inserted ${insertedData.length} company info records`);
        console.log('\n📊 Company Info Summary:');
        for (const item of insertedData) {
            console.log(`- ${item.section}: ${item.title}`);
        }
        console.log('\n🎉 Company Info seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding company info:', error);
        process.exit(1);
    }
};
seedCompanyInfo();

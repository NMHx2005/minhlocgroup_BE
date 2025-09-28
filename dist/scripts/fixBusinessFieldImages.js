"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("../config/database");
const core_1 = require("../models/core");
async function fixBusinessFieldImages() {
    try {
        await (0, database_1.connectDatabase)();
        console.log('🔌 Connected to database');
        const fields = await core_1.BusinessField.find({});
        console.log(`📊 Found ${fields.length} business fields`);
        for (const field of fields) {
            let needsUpdate = false;
            const updateData = {};
            if (field.image && !isValidImageUrl(field.image)) {
                updateData.image = 'https://via.placeholder.com/800x600/4CAF50/FFFFFF.jpg';
                needsUpdate = true;
                console.log(`🔧 Fixing main image for field: ${field.name}`);
            }
            if (field.projects && field.projects.length > 0) {
                const updatedProjects = field.projects.map((project) => {
                    if (project.image && !isValidImageUrl(project.image)) {
                        console.log(`🔧 Fixing project image for: ${project.name}`);
                        return {
                            ...project,
                            image: 'https://via.placeholder.com/400x300/2196F3/FFFFFF.jpg'
                        };
                    }
                    return project;
                });
                if (JSON.stringify(updatedProjects) !== JSON.stringify(field.projects)) {
                    updateData.projects = updatedProjects;
                    needsUpdate = true;
                }
            }
            if (needsUpdate) {
                await core_1.BusinessField.findByIdAndUpdate(field._id, updateData);
                console.log(`✅ Updated field: ${field.name}`);
            }
        }
        console.log('🎉 All business fields have been fixed!');
    }
    catch (error) {
        console.error('❌ Error fixing business fields:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('🔌 Disconnected from database');
    }
}
function isValidImageUrl(url) {
    if (!url || url === '')
        return true;
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url) ||
        /^https?:\/\/via\.placeholder\.com/.test(url) ||
        /^https?:\/\/res\.cloudinary\.com/.test(url);
}
if (require.main === module) {
    fixBusinessFieldImages()
        .then(() => {
        console.log('✅ Script completed successfully');
        process.exit(0);
    })
        .catch((error) => {
        console.error('❌ Script failed:', error);
        process.exit(1);
    });
}
exports.default = fixBusinessFieldImages;

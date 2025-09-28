"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("../config/database");
const core_1 = require("../models/core");
async function fixSpecificBusinessField() {
    try {
        await (0, database_1.connectDatabase)();
        console.log('🔌 Connected to database');
        const fieldId = '68d7c6da01af0f0282ff5eb3';
        const field = await core_1.BusinessField.findById(fieldId);
        if (!field) {
            console.log('❌ BusinessField not found');
            return;
        }
        console.log(`📊 Found field: ${field.name}`);
        console.log('🔍 Current projects:', JSON.stringify(field.projects, null, 2));
        const updatedProjects = field.projects.map((project) => {
            if (project.image === 'test' || !isValidImageUrl(project.image)) {
                console.log(`🔧 Fixing project image for: ${project.name}`);
                return {
                    ...project,
                    image: 'https://via.placeholder.com/400x300/2196F3/FFFFFF.jpg'
                };
            }
            return project;
        });
        await core_1.BusinessField.findByIdAndUpdate(fieldId, {
            projects: updatedProjects
        });
        console.log('✅ Updated field with valid project images');
        console.log('🔍 Updated projects:', JSON.stringify(updatedProjects, null, 2));
    }
    catch (error) {
        console.error('❌ Error fixing business field:', error);
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
    fixSpecificBusinessField()
        .then(() => {
        console.log('✅ Script completed successfully');
        process.exit(0);
    })
        .catch((error) => {
        console.error('❌ Script failed:', error);
        process.exit(1);
    });
}
exports.default = fixSpecificBusinessField;

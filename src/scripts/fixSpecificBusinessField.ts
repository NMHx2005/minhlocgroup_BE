import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import { BusinessField } from '../models/core';

async function fixSpecificBusinessField() {
    try {
        await connectDatabase();
        console.log('🔌 Connected to database');

        // Fix the specific BusinessField with ID 68d7c6da01af0f0282ff5eb3
        const fieldId = '68d7c6da01af0f0282ff5eb3';
        const field = await BusinessField.findById(fieldId);

        if (!field) {
            console.log('❌ BusinessField not found');
            return;
        }

        console.log(`📊 Found field: ${field.name}`);
        console.log('🔍 Current projects:', JSON.stringify(field.projects, null, 2));

        // Fix the project image
        const updatedProjects = field.projects.map((project: any) => {
            if (project.image === 'test' || !isValidImageUrl(project.image)) {
                console.log(`🔧 Fixing project image for: ${project.name}`);
                return {
                    ...project,
                    image: 'https://via.placeholder.com/400x300/2196F3/FFFFFF.jpg'
                };
            }
            return project;
        });

        // Update the field
        await BusinessField.findByIdAndUpdate(fieldId, {
            projects: updatedProjects
        });

        console.log('✅ Updated field with valid project images');
        console.log('🔍 Updated projects:', JSON.stringify(updatedProjects, null, 2));

    } catch (error) {
        console.error('❌ Error fixing business field:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from database');
    }
}

function isValidImageUrl(url: string): boolean {
    if (!url || url === '') return true; // Allow empty

    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url) ||
        /^https?:\/\/via\.placeholder\.com/.test(url) ||
        /^https?:\/\/res\.cloudinary\.com/.test(url);
}

// Run the script
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

export default fixSpecificBusinessField;

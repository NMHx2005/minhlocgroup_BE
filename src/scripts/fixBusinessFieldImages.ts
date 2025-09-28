import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import { BusinessField } from '../models/core';

async function fixBusinessFieldImages() {
    try {
        await connectDatabase();
        console.log('🔌 Connected to database');

        // Find all business fields
        const fields = await BusinessField.find({});
        console.log(`📊 Found ${fields.length} business fields`);

        for (const field of fields) {
            let needsUpdate = false;
            const updateData: any = {};

            // Fix main image if it's invalid
            if (field.image && !isValidImageUrl(field.image)) {
                updateData.image = 'https://via.placeholder.com/800x600/4CAF50/FFFFFF.jpg';
                needsUpdate = true;
                console.log(`🔧 Fixing main image for field: ${field.name}`);
            }

            // Fix project images
            if (field.projects && field.projects.length > 0) {
                const updatedProjects = field.projects.map((project: any) => {
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

            // Update if needed
            if (needsUpdate) {
                await BusinessField.findByIdAndUpdate(field._id, updateData);
                console.log(`✅ Updated field: ${field.name}`);
            }
        }

        console.log('🎉 All business fields have been fixed!');
    } catch (error) {
        console.error('❌ Error fixing business fields:', error);
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

export default fixBusinessFieldImages;

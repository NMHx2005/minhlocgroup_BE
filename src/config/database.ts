import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export interface DatabaseConfig {
    url: string;
    options?: Record<string, any>;
}

export const databaseConfig: DatabaseConfig = {
    url: process.env.DATABASE_URL || 'mongodb+srv://hungnm22092005_db_user:yBeWlzGMkSjUBC5F@cluster0.i0hlorz.mongodb.net/MinhLocGroups',
    options: {
        // MongoDB options
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        // Removed bufferMaxEntries as it's deprecated in newer MongoDB drivers
    },
};

/**
 * Connect to MongoDB database
 */
export const connectDatabase = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(databaseConfig.url, databaseConfig.options);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });

    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDatabase = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log('🔌 MongoDB disconnected');
    } catch (error) {
        console.error('❌ Error disconnecting from MongoDB:', error);
    }
};

export default databaseConfig;

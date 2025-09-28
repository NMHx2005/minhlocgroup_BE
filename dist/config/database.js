"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = exports.databaseConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
exports.databaseConfig = {
    url: process.env.DATABASE_URL || 'mongodb+srv://hungnm22092005_db_user:yBeWlzGMkSjUBC5F@cluster0.i0hlorz.mongodb.net/MinhLocGroups',
    options: {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
    },
};
const connectDatabase = async () => {
    try {
        const conn = await mongoose_1.default.connect(exports.databaseConfig.url, exports.databaseConfig.options);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        mongoose_1.default.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });
        mongoose_1.default.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    try {
        await mongoose_1.default.disconnect();
        console.log('🔌 MongoDB disconnected');
    }
    catch (error) {
        console.error('❌ Error disconnecting from MongoDB:', error);
    }
};
exports.disconnectDatabase = disconnectDatabase;
exports.default = exports.databaseConfig;
//# sourceMappingURL=database.js.map
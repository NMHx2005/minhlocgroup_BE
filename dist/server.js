"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        const server = app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 API URL: http://localhost:${PORT}/api/v1`);
            console.log(`📊 Health Check: http://localhost:${PORT}/health`);
        });
        process.on('unhandledRejection', (err) => {
            console.error('Unhandled Promise Rejection:', err.message);
            server.close(() => {
                process.exit(1);
            });
        });
        process.on('uncaughtException', (err) => {
            console.error('Uncaught Exception:', err.message);
            process.exit(1);
        });
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                console.log('Process terminated');
                process.exit(0);
            });
        });
        return server;
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();

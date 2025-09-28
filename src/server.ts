import app from './app';
import { connectDatabase } from './config/database';

const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
    try {
        // Connect to database first
        await connectDatabase();

        // Start server after database connection
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 API URL: http://localhost:${PORT}/api/v1`);
            console.log(`📊 Health Check: http://localhost:${PORT}/health`);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err: Error) => {
            console.error('Unhandled Promise Rejection:', err.message);
            server.close(() => {
                process.exit(1);
            });
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (err: Error) => {
            console.error('Uncaught Exception:', err.message);
            process.exit(1);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                console.log('Process terminated');
                process.exit(0);
            });
        });

        return server;
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();
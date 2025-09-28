"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const checkDatabaseConnection = (req, res, next) => {
    if (mongoose_1.default.connection.readyState !== 1) {
        res.status(503).json({
            success: false,
            message: 'Database connection not ready',
            error: 'Database is not connected'
        });
        return;
    }
    next();
};
exports.checkDatabaseConnection = checkDatabaseConnection;
//# sourceMappingURL=database.js.map
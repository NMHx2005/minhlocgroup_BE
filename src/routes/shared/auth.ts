import { Router } from 'express';
import {
    login,
    register,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    changePassword,
    getProfile,
    updateProfile,
    verifyEmail,
    resendVerification
} from '../../controllers/shared/authController';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

// Public auth routes
router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

// Protected auth routes
router.use(authMiddleware);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/change-password', changePassword);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;

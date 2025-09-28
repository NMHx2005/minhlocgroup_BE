import { Router } from 'express';
import { getCompanyInfo } from '../../controllers/client/companyController';

const router = Router();

// Public company info routes
router.get('/info', getCompanyInfo);

export default router;

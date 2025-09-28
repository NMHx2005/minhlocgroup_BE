import { Router } from 'express';
import {
    getBusinessFields,
    getBusinessFieldBySlug
} from '../../controllers/client/businessFieldController';

const router = Router();

// Public business fields routes
router.get('/', getBusinessFields);
router.get('/:slug', getBusinessFieldBySlug);

export default router;

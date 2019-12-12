import { Router } from 'express';
import { getLocationController } from '../controllers';
import { authenticate } from '../middleware/auth';
import { makeCallback } from '../utils/express-utils';

const router = Router();
const locationController = getLocationController();

router.post('/', authenticate, makeCallback(
    (req) => locationController.postUserLocation(req)));
router.get('/:from-:to', authenticate, makeCallback(
    (req) => (null)));

export default router;
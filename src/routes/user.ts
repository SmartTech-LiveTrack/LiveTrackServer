import { Router } from 'express';

import { getUserController } from '../controllers';
import { authenticate } from '../middleware/auth';
import { makeCallback } from '../utils/express-utils';

const router = Router();

let userController = getUserController();

router.post('/', makeCallback((req) => userController.postUser(req)));
router.post('/authenticate', makeCallback((req) => userController.authenticateUser(req)));

router.use(authenticate);
router.post('/contacts/', makeCallback((req) => userController.postUserContact(req)));

export default router;
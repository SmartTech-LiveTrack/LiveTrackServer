import { Router } from 'express';

import { getUserController } from '../controllers';
import { RequestEntity } from '../models/http';
import { authenticate } from '../middleware/auth';

const router = Router();

let userController = getUserController();

const makeCallback = (handler: (body: RequestEntity<any>) => Promise<any>) => {
    return async (req, res, next) => {
        let body = {
            url: req.url,
            body: req.body,
            params: req.params,
            user: req.user,
        };
        try {
            let response = await handler(body);
            return res.status(response.statusCode)
                .json(response.body);
        } catch (e) {
            next(e);
        }
    }
}

router.post('/', makeCallback((req) => userController.postUser(req)));
router.post('/authenticate', makeCallback((req) => userController.authenticateUser(req)));

router.use(authenticate);
router.post('/contacts/', makeCallback((req) => userController.postUserContact(req)));

export default router;
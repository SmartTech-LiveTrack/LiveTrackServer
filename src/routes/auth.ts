import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import { SECRET } from '../config/constants';
import User from '../data/user';
import { authenticate } from '../middleware/auth';
import ApiResponse from '../models/api-response';
import UserResponse from '../models/user-response';

const router = Router();

router.post('/login',
    (req, res, next) => {
        passport.authenticate('local',
            { session: false },
            (err, user) => {
                if (err || !user) {
                    next(err);
                } else {
                    req.login(user, { session: false }, 
                        (err) => {
                            if (err) {
                                next(err);
                                return;
                            }
                            const token = jwt.sign({
                                id: user.getId(),
                                email: user.getEmail(),
                            }, SECRET);
                            return res.json(ApiResponse.success(
                                { user, token }, "Authenticated"
                            ));
                    });
                }
            })(req, res);
    }
);

router.get('/me', 
    authenticate, 
    (req, res) => {
        res.json(ApiResponse.success(
            new UserResponse(req.user as User), "Authenticated User"));
});
export default router;
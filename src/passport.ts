import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import { SECRET } from './config/constants';
import { getUserService } from './use-cases';

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function (email, password, done) {
        let userService = getUserService();
        userService.authenticate(email, password)
            .then((user) => {
                if (user) done(null, user);
                else done(null, false);
            })
            .catch(err => {
                done(err, false)
            });
    }
));

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET,
}
passport.use(new JwtStrategy(options, (payload, done) => {
    let userService = getUserService();
    userService.findUserById(payload.id)
        .then((user) => done(null, user))
        .catch(err => done(err, false));
}));
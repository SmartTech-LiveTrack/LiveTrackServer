import chai from 'chai';
import chaiHttp from 'chai-http';
import HttpStatus from 'http-status-codes';

chai.use(chaiHttp);

import { addUser } from './user-utils';

const apiPrefix = "/api/v1/";

export const authenticate = (
    app, email, password, callback: Function) => {
    chai.request(app)
        .post(apiPrefix+"auth/login")
        .send({ email, password })
        .end((err, res) => callback(err, res));
}; 

export const addAndAuthenticate = (app, user, callback: Function) => {
    addUser(
        app, 
        user, 
        (err, res) => {
            res.should.have.status(HttpStatus.OK);
            let savedUser = res.body.data.user;
            authenticate(
                app, 
                user.email, 
                user.password, 
                (err, res) => {
                    res.should.have.status(HttpStatus.OK);
                    callback(
                        savedUser,
                        res.body.data.token
                    )
                }
            );
        });
}
import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import HttpStatus from 'http-status-codes';

import { getUserRepo } from '../../src/repos';
import { addUser } from '../fixtures/user-utils';

const should = chai.should();
chai.use(chaiHttp);

const dummyUser = {
    firstname: "Novo",
    lastname: "Emma",
    password: "password",
    email: "email@mail.com",
    tel: "tel",
    contacts: [
        {
            firstname: "Bob",
            lastname: "Emma",
            email: "validcontact@mail.com",
            tels: [
                "080", "090"
            ]
        }
    ]
};

export default function (app, apiPrefix) {
    apiPrefix += "auth/";

    describe('Auth Api', () => {
        let userRepo;
        before(async () => {
            userRepo = getUserRepo();
        })

        beforeEach(async () => {
            await userRepo.deleteAll();
        });

        const logIn = (email: string, password: string, end) => {
            chai.request(app)
                .post(apiPrefix + 'login')
                .send({
                    email,
                    password
                })
                .end(end);
        }

        describe('validation', () => {
            it('should reject a user without a token', (done) => {
                chai.request(app)
                    .get(apiPrefix + 'me')
                    .end((err, res) => {
                        res.should.have.status(HttpStatus.UNAUTHORIZED);
                        done();
                    });
            });

            it('should reject a user with an invalid token', (done) => {
                chai.request(app)
                    .get(apiPrefix + 'me')
                    .set("Authorization", "invalidtoken")
                    .end((err, res) => {
                        res.should.have.status(HttpStatus.UNAUTHORIZED);
                        done();
                    });
            });
        });

        describe('functionality', () => {
            it('should log the user in', (done) => {
                const email = dummyUser.email;
                const password = dummyUser.password;
                addUser(
                    app,
                    dummyUser,
                    (err, res) => {
                        res.should.have.status(HttpStatus.OK);
                        logIn(email, password, (err, res) => {
                            res.should.have.status(HttpStatus.OK);
                            res.body.should.have.property('data');
                            res.body.data.should.have.property('token');
                            res.body.data.user.should.have.property('email').eq(email);
                            done();
                        });
                    });
            })

            it('should return the current logged in user', (done) => {
                const email = dummyUser.email;
                const password = dummyUser.password;
                addUser(
                    app,
                    dummyUser,
                    (err, res) => {
                        res.should.have.status(HttpStatus.OK);
                        logIn(email, password, (err, res) => {
                            res.should.have.status(HttpStatus.OK);
                            let authToken = `Bearer ${res.body.data.token}`;
                            chai.request(app)
                                .get(apiPrefix + 'me')
                                .set("Authorization", authToken)
                                .end((err, res) => {
                                    res.should.have.status(HttpStatus.OK);
                                    res.body.data.should.have.property('email').eq(email);
                                    done();
                                });
                        });
                    });
            });
        });
    });
}
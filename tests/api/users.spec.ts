import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import HttpStatus from 'http-status-codes';

import { getUserRepo } from '../../src/repos';
import { addAndAuthenticate } from '../fixtures/auth-utils';
import { addUser } from '../fixtures/user-utils';
import { putVerificationCode } from '../../src/utils/phone-number-verification';

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
    apiPrefix += "users/";
    describe('Users Api', () => {
        let userRepo;
        before(async () => {
            userRepo = getUserRepo();
        })

        beforeEach(async () => {
            await userRepo.deleteAll();
        });

        describe('functionality', () => {
            it('should add a user', (done) => {
                const email = dummyUser.email;
                addUser(
                    app,
                    dummyUser,
                    (err, res) => {
                        res.should.have.status(HttpStatus.OK);
                        res.body.should.have.property('data');
                        res.body.data.user.should.have.property('email').eq(email);
                        done();
                    });
            });

            it('should authenticate a user', (done) => {
                const email = dummyUser.email;
                const password = dummyUser.password;
                addUser(
                    app,
                    dummyUser,
                    () => {
                        chai.request(app)
                            .post(apiPrefix + 'authenticate')
                            .send({
                                email,
                                password
                            })
                            .end((err, res) => {
                                res.should.have.status(HttpStatus.OK);
                                res.body.should.have.property('data');
                                res.body.data.should.have.property('email').eq(email);
                                done();
                            });
                    });
            });

            it('should add a new contact to a user', (done) => {
                const email = 'dare@mail.com';
                addAndAuthenticate(
                    app,
                    dummyUser,
                    (user, token) => {
                        let userId = user._id;
                        chai.request(app)
                            .post(`${apiPrefix}contacts/`)
                            .set("Authorization", `bearer ${token}`)
                            .send({
                                firstname: 'lade',
                                lastname: 'dare',
                                email,
                                tels: ["080", "090"]
                            })
                            .end((err, res) => {
                                res.should.have.status(HttpStatus.OK);
                                res.body.data.should.have.property("_id").not.eq(undefined);
                                res.body.data.should.have.property("email").eq(email);
                                done();
                            });
                    });
            });

            it('should verify user tel number', (done) => {
                let requestId = "test-request";
                let code = "codeX";
                putVerificationCode(requestId, code);
                addUser(
                    app,
                    dummyUser,
                    (err, res) => {
                        res.should.have.status(HttpStatus.OK);
                        chai.request(app)
                            .get(`${apiPrefix}verify-user-number/?` +
                                `email=${dummyUser.email}&&` +
                                `requestId=${requestId}&&code=${code}`)
                            .end((err, res) => {
                                res.should.have.status(HttpStatus.OK);
                                done();
                            });
                    });
            });
        });
    });
};
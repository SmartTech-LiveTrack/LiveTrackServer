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
                        res.body.data.should.have.property('email').eq(email);
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
        });
    });
};
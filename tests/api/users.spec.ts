import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import HttpStatus from 'http-status-codes';

import { getUserRepo } from '../../src/repos';
import { addUser } from '../fixtures/user-utils';

const should = chai.should();
chai.use(chaiHttp);

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
                const email = "email@mail.com";
                addUser(app,
                {
                    firstname: "Novo",
                    lastname: "Emma",
                    password: "password",
                    email,
                    tel: "tel",
                },
                    (err, res) => {
                        res.should.have.status(HttpStatus.OK);
                        res.body.should.have.property('data');
                        res.body.data.should.have.property('email').eq(email);
                        done();
                    });
            });
    
            it('should authenticate a user', (done) => {
                const email = "email@mail.com";
                const password = "password";
                addUser(app,
                {
                    firstname: "Novo",
                    lastname: "Emma",
                    password,
                    email,
                    tel: "tel",
                }, () => {
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
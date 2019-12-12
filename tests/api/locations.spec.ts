import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import HttpStatus from 'http-status-codes';

import { getLocationRepo, getUserRepo } from '../../src/repos';

import { addAndAuthenticate } from '../fixtures/auth-utils';

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

const dummyLocation = {
    longitude: 90.0,
    latitude: -90.0,
    timestamp: "2019-10-09T00:00:00",
}

export default function (app, apiPrefix) {
    apiPrefix += "locations/";
    describe('Locations API', () => {
        let locationRepo;
        let userRepo;
        before(async () => {
            userRepo = getUserRepo();
            locationRepo = getLocationRepo();
        })

        beforeEach(async () => {
            await userRepo.deleteAll();
            await locationRepo.deleteAll();
        });

        it('should post a location', (done) => {
            addAndAuthenticate(app, dummyUser, (user, token) => {
                chai.request(app)
                    .post(apiPrefix)
                    .set('Authorization', `bearer ${token}`)
                    .send(dummyLocation)
                    .end((err, res) => {
                        res.should.have.status(HttpStatus.OK);
                        res.body.data.should.include({
                            longitude: dummyLocation.longitude,
                            latitude: dummyLocation.latitude,
                            createdBy: user._id.toString()
                        });
                        done();
                    });
            });
        });

        it('should get locations within a time range', (done) => {
            addAndAuthenticate(app, dummyUser, (user, token) => {
                chai.request(app)
                    .get(`${apiPrefix}/`)
                    .set('Authorization', `bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(HttpStatus.OK);
                        // res.body.data.should.include({
                        //     longitude: dummyLocation.longitude,
                        //     latitude: dummyLocation.latitude,
                        //     createdBy: user._id.toString()
                        // });
                        done();
                    });
            });
        });
    });
}
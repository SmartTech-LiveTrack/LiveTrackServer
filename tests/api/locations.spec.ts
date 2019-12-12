import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import HttpStatus from 'http-status-codes';

import Location from '../../src/data/location';

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
            const dates = [
                new Date("2019-10-10T00:00:00"), 
                new Date("2019-10-12T00:00:00"),
                new Date("2019-11-10T00:00:00")
            ];
            const testIndex = 1;
            addAndAuthenticate(app, dummyUser, async (user, token) => {
                for(let i = 0; i < dates.length; i++) {
                    let date = dates[i];
                    await locationRepo.saveLocation(new Location(
                        null, 50.0, 50.0, user._id, date));
                }
                
                chai.request(app)
                    .get(`${apiPrefix}/?from=${
                        dates[testIndex].toUTCString()}&&to=${new Date()}`)
                    .set('Authorization', `bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(HttpStatus.OK);
                        let dataLength = dates.length - testIndex;
                        res.body.data.should.have.property('length')
                            .to.eq(dataLength);
                        new Date(res.body.data[0].createdAt).getTime()
                            .should.eq(dates[testIndex].getTime());
                        new Date(res.body.data[dataLength - 1].createdAt).getTime()
                            .should.eq(dates[dates.length - 1].getTime());
                        done();
                    });
            });
        });
    });
}
import { expect } from 'chai';
import 'mocha';

import ConstraintViolationError from '../../src/errors/contraint_violation_error';
import Location from '../../src/data/location';

describe('Location Data', () => {
    it('should not create a Location with missing or invalid info', () => {
        let id = null;
        let latitude = -50;
        let longitude = 70.5;
        let createdAt = new Date();
        let createdBy = "randomId";
        let invalidLogitude = (longitude) => () => (new Location(
            id, longitude, latitude, createdBy, createdAt));
        let invalidLatitude = (latitude) => () => (new Location(
            id, longitude, latitude, createdBy, createdAt
        ));
        let invalidCreatedBy = (createdBy) => () => (new Location(
            id, longitude, latitude, createdBy, createdAt
        ));
        let invalidCreatedAt = (createdAt) => () => (new Location(
            id, longitude, latitude, createdBy, createdAt
        ));

        expect(invalidLogitude(null)).to.throw(ConstraintViolationError);
        expect(invalidLogitude(NaN)).to.throw(ConstraintViolationError);
        
        expect(invalidLatitude(null)).to.throw(ConstraintViolationError);
        expect(invalidLatitude(NaN)).to.throw(ConstraintViolationError);

        expect(invalidCreatedBy(undefined)).to.throw(ConstraintViolationError);
        expect(invalidCreatedBy(null)).to.throw(ConstraintViolationError);

        expect(invalidCreatedAt(undefined)).to.throw(ConstraintViolationError);
        expect(invalidCreatedAt(null)).to.throw(ConstraintViolationError);
    });

    it('should create a Location', () => {
        let id = null;
        let latitude = -50;
        let longitude = 70.5;
        let createdAt = new Date();
        let createdBy = "randomId";
        new Location(
            id, longitude, latitude, createdBy, createdAt);
    });
});
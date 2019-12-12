import { expect } from 'chai';
import 'mocha';
import { ObjectID, Collection } from 'mongodb';

import { close as closeDb, connect, getDb } from '../../src/config/db';
import Location from '../../src/data/location';
import LocationRepoImpl, { LocationDocumentFormat } from '../../src/repos/location-repo-impl';
import { createObjectIdWithTimestamp } from '../../src/utils/mongo-utils';

describe('Location MongoDB Repo', () => {
    let locationRepo: LocationRepoImpl;
    let db: Collection<LocationDocumentFormat>;

    before(async () => {
        await connect();
        db = getDb().collection('locations');
        locationRepo = new LocationRepoImpl(getDb());
    });

    beforeEach(async () => {
        await db.deleteMany({});
    });

    after(async () => {
        await closeDb();
    });

    const userId = new ObjectID("user00000000");
    const otherUserId = new ObjectID("otheruser000");
    const getLocationWithTimestamp = (timestamp: Date) => (
        {
            _id: createObjectIdWithTimestamp(timestamp),
            location: {
                type: "Point",
                coordinates: [70.5, -80.9]
            },
            createdBy: userId,
        }
    );

    it('shoult not return locations owned by the another user', async () => {
        const currentTimeInMilleseconds = Date.now();
        const dateBase = new Date(currentTimeInMilleseconds);
        const date1 = new Date(currentTimeInMilleseconds + 1000);
        const date2 = new Date(currentTimeInMilleseconds + 2000);
        let loc1 = getLocationWithTimestamp(date1);
        let loc2 = getLocationWithTimestamp(date2);
        await db.insertMany([
            loc1, loc2
        ] as Array<LocationDocumentFormat>);
        let results = await locationRepo.findAllLocationsByUserFromTo(
            otherUserId, dateBase);
        expect(results.length).to.eq(0);
    });

    it('should find locations greater than specified start time', async () => {
        const currentTimeInMilleseconds = Date.now();
        const dateBase = new Date(currentTimeInMilleseconds);
        const date1 = new Date(currentTimeInMilleseconds + 1000);
        const date2 = new Date(currentTimeInMilleseconds + 2000);
        let loc1 = getLocationWithTimestamp(date1);
        let loc2 = getLocationWithTimestamp(date2);
        await db.insertMany([
            loc1, loc2
        ] as Array<LocationDocumentFormat>);
        let results = await locationRepo.findAllLocationsByUserFromTo(
            userId, dateBase);
        expect(results.length).to.eq(2);
        expect(results[0].getId().toString())
        .to.eq(loc1._id.toHexString());
        expect(results[1].getId().toString())
        .to.eq(loc2._id.toHexString());
    });

    it('should find locations within specified timerange, async', async () => {
        const currentTimeInMilleseconds = Date.now();
        const dateBase = new Date(currentTimeInMilleseconds);
        const date1 = new Date(currentTimeInMilleseconds + 1000);
        const date2 = new Date(currentTimeInMilleseconds + 2000);
        let loc1 = getLocationWithTimestamp(date1);
        let loc2 = getLocationWithTimestamp(date2);
        await db.insertMany([
            loc1, loc2
        ] as Array<LocationDocumentFormat>);
        let results = await locationRepo.findAllLocationsByUserFromTo(
            userId, dateBase, date1);
        expect(results.length).to.eq(1);
        expect(results[0].getId().toString())
        .to.eq(loc1._id.toHexString());
    });

    it('should save location in db', async () => {
        let location = new Location(
            null, 70.9, -50.5, userId, new Date());
        let savedLocation = await locationRepo.saveLocation(location);
        let cursor = await db.find({ createdBy: userId });
        let results = await cursor.toArray();
        expect(results.length).to.eq(1);
        expect(results[0]._id.toHexString())
            .to.eq(savedLocation.getId().toString());
    });
});
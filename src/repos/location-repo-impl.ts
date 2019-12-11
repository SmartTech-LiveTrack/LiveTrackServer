import { Db, Collection, Cursor, ObjectID } from 'mongodb';

import Location from '../data/location';
import LocationRepository from "./location-repository";
import { createObjectIdWithTimestamp } from '../utils/mongo-utils';

class LocationRepoImpl implements LocationRepository {
    private db: Collection<LocationDocumentFormat>;

    constructor(client: Db) {
        this.db = client.collection('locations');
    }

    async findAllLocationsByUserFromTo(id: Object, startTime: Date, endTime?: Date):
        Promise<Array<Location>> {
        let query = {
            _id: {
                $gt: createObjectIdWithTimestamp(startTime),
            },
            createdBy: new ObjectID(id.toString())
        };
        if (endTime) {
            query._id = {
                ...query._id, 
                $lte: createObjectIdWithTimestamp(endTime)
            } as any;
        }
        let cursor: Cursor<LocationDocumentFormat> = await this.db.find(query);
        let results = await cursor.toArray();
        return results.map(result => (
            LocationDocumentFormat.bindPrototype(result).toLocation()
        ));
    }

    async saveLocation(location: Location): Promise<Location> {
        let locationDoc = LocationDocumentFormat.fromLocation(location);
        let result = await this.db.insertOne(locationDoc);
        if (result.insertedCount = 1) {
            let savedLoc: LocationDocumentFormat = result.ops[0] as any;
            savedLoc = LocationDocumentFormat.bindPrototype(savedLoc);
            return savedLoc.toLocation();
        }
        throw new Error("Failed to save location");
    }
}

export class LocationDocumentFormat {
    _id: ObjectID;
    location: {
        type: "Point",
        coordinates: [number, number]
    }
    createdBy: ObjectID;

    toLocation(): Location {
        return new Location(
            this._id,
            this.location.coordinates[0],
            this.location.coordinates[1],
            this.createdBy,
            this._id.getTimestamp()
        );
    }

    static bindPrototype(loc: LocationDocumentFormat) {
        return Object.setPrototypeOf(
            loc, LocationDocumentFormat.prototype);
    }

    static fromLocation(loc: Location) {
        let document = new LocationDocumentFormat();
        document._id = loc.getId() as ObjectID;
        if (!document._id) document._id = new ObjectID();
        document.location = {
            type: "Point",
            coordinates: [loc.getLongitude(), loc.getLatitude()]
        };
        document.createdBy = loc.getCreatedBy() as ObjectID;
        return document;
    }
}

export default LocationRepoImpl;
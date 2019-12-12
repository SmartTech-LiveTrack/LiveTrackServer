import { ObjectID } from "mongodb";

export function createObjectIdWithTimestamp(timestamp: Date) {
    let hexSeconds = Math.floor(
        timestamp.getTime()/1000).toString(16);
    let constructedObjectId = new ObjectID(hexSeconds + "0000000000000000");

    return constructedObjectId
}
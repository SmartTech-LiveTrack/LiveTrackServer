import { ObjectID } from "mongodb";

export function createObjectIdWithTimestamp(timestamp: Date) {
    return ObjectID.createFromTime(
        timestamp.getTime() / 1000)
}
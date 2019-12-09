import mongodb, { MongoClient } from 'mongodb';
import AsyncLock from 'async-lock';

import { 
    DB_NAME, 
    DB_URL, 
    DB_USERNAME, 
    DB_PASSWORD } from './constants';

const lock = new AsyncLock();
const lockKey = "key";
let numberOfConnections = 0;
let client: MongoClient;
let db: mongodb.Db;

const doConnect = async () => {
    try {
        client = await mongodb.connect(
            DB_URL, { useUnifiedTopology: true });
        db = client.db(DB_NAME);
        console.log("Database connected successfully");
        
        client.on('close', () => {
            console.log('Closing db connection...');
        });        
    } catch (e) {
        console.log("Unable to connect the database");
        console.error(e);
    }
}

const tryToConnect = async () => {
    numberOfConnections += 1;
    if (client && client.isConnected()) {
        console.log("Already Connected");
        return;
    }
    await doConnect();
}

export const connect = async () => {
    await lock.acquire(lockKey, function () {
        return tryToConnect();
    });
} 


const tryToClose = async () => {
    numberOfConnections -= 1;
    if (numberOfConnections == 0) {
        await client.close();
    }
}

export const close = async () => {
    await lock.acquire(lockKey, function () {
        return tryToClose();
    });
}

export const getDb = () => {
    if (!db) {
        throw new Error("Database has not been connected");
    }
    return db;
};
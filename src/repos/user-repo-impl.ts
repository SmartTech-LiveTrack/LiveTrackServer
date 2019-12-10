import { Db, Collection, Cursor, ObjectID } from 'mongodb';

import User from '../data/user';

import UserRepository from './user-repository';

class UserRepoImpl implements UserRepository {
    private db: Collection<User>;
    constructor(client: Db) {
        this.db = client.collection('users');
    }

    async findByEmail(email: String): Promise<User | undefined> {
        let query = { email };
        let cursor: Cursor<User> = await this.db.find(query);
        let results = await cursor.toArray();
        if (results.length === 0) return undefined;
        return User.fromUser(results[0]);
    }

    async save(user: User): Promise<User> {
        let contacts = this.assignIdsToContact(user);
        let transformedUser = new User(
            user.getFirstname(), user.getMiddlename(),
            user.getLastname(), user.getPassword(),
            user.getEmail(), user.getTel(), contacts
        );
        let result = await this.db.insertOne(transformedUser);
        if (result.insertedCount = 1) {
            let savedUser: User = result.ops[0] as any;
            return User.fromUser(savedUser);
        }
        throw new Error("Failed to save user");
    }

    assignIdsToContact(user: User) {
        return user.getContacts()
            .map((contact) => {
                if (!contact._id) {
                    contact._id = new ObjectID();
                }
                return contact;
            });
    }

    async findById(id: Object): Promise<User | undefined> {
        let query = { _id: new ObjectID(id.toString()) };
        let cursor: Cursor<User> = await this.db.find(query);
        let results = await cursor.toArray();
        if (results.length === 0) return undefined;
        return User.fromUser(results[0]);
    }

    async update(user: User): Promise<User> {
        let contacts = this.assignIdsToContact(user);
        let transformedUser = new User(
            user.getFirstname(), user.getMiddlename(),
            user.getLastname(), user.getPassword(),
            user.getEmail(), user.getTel(), contacts
        );
        let result = await this.db.updateOne(
            { _id: user._id }, { $set: transformedUser });
        if (result.modifiedCount = 1) {
            let savedUser: User = await this.findById(user._id);
            return User.fromUser(savedUser);
        }
        throw new Error("Failed to update user");
    }

    async deleteAll(): Promise<void> {
        await this.db.deleteMany({});
    }
}

export default UserRepoImpl;
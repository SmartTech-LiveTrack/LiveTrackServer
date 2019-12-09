interface Repository<T> {

    save(object: T): Promise<T>;
    findById(id: Object): Promise<T | undefined>;
    update(object: T): Promise<T>;
    deleteAll(): Promise<void>;
}

export default Repository;
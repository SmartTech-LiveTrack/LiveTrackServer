import Location from '../data/location';

interface LocationRepository {

    findAllLocationsByUserFromTo(id: Object, startTime: Date, endTime?: Date): Promise<Array<Location>>;
    saveLocation(location: Location): Promise<Location>;
    deleteAll(): Promise<void>;
}

export default LocationRepository;
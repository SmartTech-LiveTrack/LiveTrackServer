import Location from "../data/location";
import LocationRepository from "../repos/location-repository";

class LocationService {
    private locationRepo: LocationRepository;

    constructor(locationRepo: LocationRepository) {
        this.locationRepo = locationRepo;
    }

    async logLocation(location: Location) {
        let savedLocation = await this.locationRepo.saveLocation(location);
        return savedLocation;
    }

    async findAllLocationsByUserFromTo(
        userId: Object, startTime: Date, endTime?: Date):
        Promise<Array<Location>> {
        let locations = await this.locationRepo.findAllLocationsByUserFromTo(
            userId, startTime, endTime);
        return locations;
    }
}

export default LocationService;
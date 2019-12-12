import HttpStatus from 'http-status-codes';

import Location from '../data/location';

import ApiResponse from '../models/api-response';
import { LogLocationRequest } from '../models/location';
import { RequestEntity, ResponseEntity } from '../models/http';

import LocationService from '../use-cases/location-service';

class LocationController {
    private locationService: LocationService;

    constructor(locationService: LocationService) {
        this.locationService = locationService;
    }

    async postUserLocation(req: RequestEntity<LogLocationRequest>):
        Promise<ResponseEntity<ApiResponse<Location>>> {
        let body = req.body;
        let user = req.user;
        let location = new Location(
            null, body.longitude,
            body.latitude, user.getId(), 
            new Date(body.timestamp));
        let saved = await this.locationService.logLocation(location);
        let response = ApiResponse.success<Location>(
            saved, "Location successfully logged");
        return {
            statusCode: HttpStatus.OK,
            body: response,
        };
    }

    async findLocationsByUserFromTo(req: RequestEntity<void>):
        Promise<ResponseEntity<ApiResponse<Array<Location>>>> {
        let { from, to } = req.query;
        let user = req.user;
        let locations = await this.locationService.findAllLocationsByUserFromTo(
            user._id, new Date(from), new Date(to));
        let response = ApiResponse.success(locations, "User location history");
        return {
            statusCode: 200,
            body: response
        };
    }
}

export default LocationController;
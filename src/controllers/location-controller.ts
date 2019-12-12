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
                body.latitude, user.getId(), new Date());
            let saved = await this.locationService.logLocation(location);
            let response = ApiResponse.success<Location>(
                saved, "Location successfully logged");
            return {
                statusCode: HttpStatus.OK,
                body: response,
            };
    }
}

export default LocationController;
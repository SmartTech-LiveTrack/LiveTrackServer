import { checkIfValidNumber } from '../utils/validators';
import ConstraintViolationError from '../errors/contraint_violation_error';

class Location {
    private _id: Object;
    private latitude: number;
    private longitude: number;
    private createdAt: Date;
    private createdBy: Object;

    constructor(id: Object, longitude: number, latitude: number, 
        createdBy: Object, createdAt: Date) {
            this._id = id;
            this.latitude = latitude;
            this.longitude = longitude;
            this.createdAt = createdAt;
            this.createdBy = createdBy;
            this.validate();
    }

    private validate() {
        if (!checkIfValidNumber(this.longitude)) {
            throw new ConstraintViolationError(
                "Longitude", "Longitude must be a valid number");
        }
        if (!checkIfValidNumber(this.latitude)) {
            throw new ConstraintViolationError(
                "Latitude", "Latitude must be a valid number");
        }
        if (!this.createdBy) {
            throw new ConstraintViolationError(
                "CreatedBy", "CreatedBy is required"
            );
        }
        if (!this.createdAt) {
            throw new ConstraintViolationError(
                "CreatedAt", "CreatedAt is required"
            );
        }
    }

    getId() {
        return this._id;
    }

    getLatitude() {
        return this.latitude;
    }

    getLongitude() {
        return this.longitude;
    }

    getCreatedAt() {
        return this.createdAt;
    }

    getCreatedBy() {
        return this.createdBy;
    }
}

export default Location;
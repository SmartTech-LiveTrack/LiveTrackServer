import HttpStatus from 'http-status-codes';

import ApiError from './api_error';

class ConstraintViolationError extends ApiError {
    propertyName: string;
    message: string;

    constructor(propertyName: string, message?: string) {
        super(HttpStatus.BAD_REQUEST, "Illegal input");
        Object.setPrototypeOf(this, new.target.prototype);
        this.propertyName = propertyName;
        this.message = message;
    }

    getErrors() {
        return [{
            field: this.propertyName,
            message: this.message,
        }]
    }
}

export default ConstraintViolationError;
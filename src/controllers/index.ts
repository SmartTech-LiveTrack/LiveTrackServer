import { getLocationService, getUserService } from '../use-cases';

import LocationController from './location-controller';
import UserController from './user-controller';

export const getUserController = (): UserController =>
    new UserController(getUserService());
export const getLocationController = (): LocationController =>
    new LocationController(getLocationService());
import { getLocationRepo, getUserRepo } from '../repos';

import LocationService from './location-service';
import UserService from './user-service';

export const getUserService = (): UserService => new UserService(getUserRepo());
export const getLocationService = (): LocationService => new LocationService(getLocationRepo());
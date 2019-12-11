import { getDb } from '../config/db';
import LocationRepository from './location-repository';
import LocationRepoImpl from './location-repo-impl';
import UserRepository from './user-repository';
import UserRepoImpl from './user-repo-impl';

export const getUserRepo = (): UserRepository => new UserRepoImpl(getDb());
export const getLocationRepo = (): LocationRepository => new LocationRepoImpl(getDb());
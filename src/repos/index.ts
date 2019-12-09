import { getDb } from '../config/db';
import UserRepository from './user-repository';
import UserRepoImpl from './user-repo-impl';

export const getUserRepo = (): UserRepository => new UserRepoImpl(getDb());
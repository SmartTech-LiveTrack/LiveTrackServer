import { getUserRepo } from '../repos';
import UserService from './user-service';

export const getUserService = (): UserService => new UserService(getUserRepo());
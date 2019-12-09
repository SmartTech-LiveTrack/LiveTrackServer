import { getUserService } from '../use-cases';
import UserController from './user-controller';

export const getUserController = (): UserController => new UserController(getUserService());
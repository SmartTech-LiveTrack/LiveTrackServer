import HttpStatus from 'http-status-codes';

import User, { UserContact } from '../data/user';

import ApiResponse from '../models/api-response';

import { RequestEntity, ResponseEntity } from '../models/http';
import { UserSignup } from '../models/user';
import UserResponse from '../models/user-response';

import UserService from '../use-cases/user-service';

class UserController {
    private service: UserService;

    constructor(service: UserService) {
        this.service = service;
    }

    async postUser(req: RequestEntity<UserSignup>):
        Promise<ResponseEntity<ApiResponse<UserResponse>>> {
        let body = req.body;
        let contacts = [];
        if (body.contacts) {
            contacts = body.contacts.map((contact) => (
                new UserContact(
                    contact.firstname,
                    contact.lastname,
                    contact.email,
                    contact.tels
                )
            ));
        }
        let user = new User(
            body.firstname,
            body.middlename,
            body.lastname,
            body.password,
            body.email,
            body.tel,
            contacts
        );
        let savedUser = await this.service.addUser(user);
        let response = ApiResponse.success<UserResponse>(
            new UserResponse(savedUser), "User created");
        return {
            statusCode: HttpStatus.OK,
            body: response,
        };
    }

    async authenticateUser(req: RequestEntity<{
        email: string, password: string
    }>): Promise<ResponseEntity<ApiResponse<UserResponse>>> {
        let { email, password } = req.body;
        let user = await this.service.authenticate(email, password);
        let statusCode = HttpStatus.OK;
        let response: ApiResponse<UserResponse>;
        if (user) {
            response = ApiResponse.success<UserResponse>(
                new UserResponse(user), "Authenticated");
        } else {
            statusCode = HttpStatus.FORBIDDEN;
            response = ApiResponse
                .error("Email or password incorrect", []);
        }
        return {
            statusCode,
            body: response,
        };
    }
}

export default UserController;
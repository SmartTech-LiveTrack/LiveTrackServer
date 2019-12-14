import HttpStatus from 'http-status-codes';

import User, { UserContact } from '../data/user';

import ApiResponse from '../models/api-response';

import { RequestEntity, ResponseEntity } from '../models/http';
import { UserSignup } from '../models/user';
import UserResponse, { UserContactResponse } from '../models/user-response';

import UserService from '../use-cases/user-service';

import {
    sendVerificationRequest
} from '../utils/phone-number-verification';

class UserController {
    private service: UserService;

    constructor(service: UserService) {
        this.service = service;
    }

    async postUser(req: RequestEntity<UserSignup>):
        Promise<ResponseEntity<ApiResponse<any>>> {
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
        let responseBody = await this.tryToSendVerifcationCode(savedUser);
        let response = ApiResponse.success<any>(
            responseBody, "User created");
        return {
            statusCode: HttpStatus.OK,
            body: response,
        };
    }

    async tryToSendVerifcationCode(user: User): Promise<any> {
        let response: any = { user: new UserResponse(user) };
        try {
            let verificationRequestId =
                await sendVerificationRequest(user.getTel());
            response.verification_request_id = verificationRequestId;
        } catch (e) {
            console.log(e);
        }
        return response;
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

    async postUserContact(req: RequestEntity<any>):
        Promise<ResponseEntity<ApiResponse<UserContactResponse>>> {
        let body = req.body;
        let contact = new UserContact(
            body.firstname, body.lastname, body.email, body.tels);
        let user = req.user;
        user.addContact(contact);
        let updatedUser = await this.service.updateUser(user);
        let savedContact = updatedUser.findContactByEmail(contact.getEmail());
        let response = ApiResponse.success<UserContactResponse>(
            new UserContactResponse(savedContact), "Contact added"
        );
        return {
            statusCode: HttpStatus.OK,
            body: response
        }
    }

    async verifyTel(req: RequestEntity<any>):
        Promise<ResponseEntity<ApiResponse<any>>> {
        let { email, requestId, code } = req.query;
        if (requestId && code && email) {
            await this.service.verifyUserNumber(email, requestId, code);
            return {
                statusCode: HttpStatus.OK,
                body: ApiResponse.success(null, "Verification Successful")
            };
        } else {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                body: ApiResponse.error("Email, RequestId and Code is required", [])
            };
        }

    }

    async alertUserContacts(req: RequestEntity<any>):
        Promise<ResponseEntity<ApiResponse<any>>> {
        let user = req.user;
        await this.service.alertContacts(user);
        let response = ApiResponse.success(null, "Alert sent");
        return {
            statusCode: HttpStatus.OK,
            body: response
        };
    }
}

export default UserController;
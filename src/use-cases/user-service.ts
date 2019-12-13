import UserRepository  from '../repos/user-repository';
import User from '../data/user';

import ConstraintViolationError from '../errors/contraint_violation_error';
import ResourceNotFoundError from '../errors/resource_not_found_error';

import { verifyCode, VerificationResult } from '../utils/phone-number-verification';
import PasswordEncoder from '../utils/password_encoder';
import IllegalInputError from '../errors/illegal_input_error';

class UserService {

    repo: UserRepository;
    passwordEncoder: PasswordEncoder;

    constructor(repo: UserRepository) {
        this.repo = repo;
        this.passwordEncoder = new PasswordEncoder();
    }

    async addUser(user: User) {
        let existingUser = await this.repo.findByEmail(user.getEmail());
        if (existingUser === undefined) {
            await user.encodePassword();
            return this.repo.save(user);
        } else {
            throw new ConstraintViolationError(
                "email", 
                "This email has already been used");
        }
    }

    async authenticate(email: string, password: string): Promise<User | undefined> {
        let user = await this.findUserByEmail(email);
        let doesPasswordMatch = await this.passwordEncoder
            .comparePassword(password, user.getPassword());
        if (doesPasswordMatch === true) return user;
        return undefined;
    }

    async updateUser(user: User): Promise<User> {
        if (user.getId() === undefined) {
            throw new TypeError("id cannot be undefined");
        }
        let userRec = await this.findUserById(user.getId());
        if (user.getEmail() === userRec.getEmail()) {
            return this.repo.update(user);
        }
        throw new ConstraintViolationError("Email", "Email cannot be modified");
    }

    async findUserById(id: Object) {
        let user = await this.repo.findById(id);
        if (user) return user;
        throw new ResourceNotFoundError("User", id.toString());
    }

    async findUserByEmail(email: string) {
        let user = await this.repo.findByEmail(email);
        if (user) return user;
        throw new ResourceNotFoundError("User", email);
    }

    async verifyUserNumber(
        email: string, requestId: string, code: string) {
        let user = await this.findUserByEmail(email);
        let result = await verifyCode(requestId, code);
        if (result === VerificationResult.SUCCESS) {
            user.verifyTel();
            await this.repo.update(user);
        } else if (result === VerificationResult.EXPIRED) {
            throw new IllegalInputError("Code has expired");
        } else {
            throw new IllegalInputError("Verification failed");
        }
    }
}

export default UserService;
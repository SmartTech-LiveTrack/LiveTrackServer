import { expect } from 'chai';
import 'mocha';

import User from '../../src/data/user';

import ConstraintViolationError from '../../src/errors/contraint_violation_error';

import PasswordEncoder from '../../src/utils/password_encoder';

describe('User',
    () => {
        describe('validation test', () => {
            it('should not create a user without firstname', () => {
                const createInvalidUser = () => (new User("", "m", "l","p", "q", "t"));
                expect(createInvalidUser).to.throw(ConstraintViolationError);
            });
    
            it('should not create a user without lastname', () => {
                const createInvalidUser = () => (new User("f", "m", "","p", "q", "t"));
                expect(createInvalidUser).to.throw(ConstraintViolationError);
            });

            it('should not create a user without password', () => {
                const createInvalidUser = () => (new User("f", "m", "l", "", "email@mail.com", "080"));
                expect(createInvalidUser).to.throw(ConstraintViolationError);
            });
    
            it('should not create a user without email', () => {
                const createInvalidUser = () => (new User("f", "m", "l","p", "", "t"));
                expect(createInvalidUser).to.throw(ConstraintViolationError);
            });
    
            it('should not create a user without tel', () => {
                const createInvalidUser = () => (new User("f", "m", "l", "p", "q", ""));
                expect(createInvalidUser).to.throw(ConstraintViolationError);
            });
    
            it('should not create a user with an invalid email', () => {
                const createInvalidUser = (email: string) => {
                    return () => (new User("f", "m", "l", "p", email, "t"));
                };
                expect(createInvalidUser("email")).to.throw(ConstraintViolationError);
                expect(createInvalidUser("email.com")).to.throw(ConstraintViolationError);
                expect(createInvalidUser("email@")).to.throw(ConstraintViolationError);
                expect(createInvalidUser("email@mail.com")).to.not.throw(ConstraintViolationError);
            });

            it('should create a user successfully', () => {
                new User("f", "m", "l", "p", "email@mail.com", "t");
            });
        });
        describe('password test', () => {
            it('should hash password', async () => {
                let password: string = "password";
                let wrongPassword: string = "wrongpassword";
                let encoder = new PasswordEncoder();
                let user = new User("f", "m", "l", password, "email@g.com", "t");
                await user.encodePassword();
                let hashedPassword = user.getPassword();
                let result = await encoder.comparePassword(password, hashedPassword);
                expect(result).to.equal(true);
                result = await encoder.comparePassword(wrongPassword, hashedPassword);
                expect(result).to.equal(false);
            });
        });
    });
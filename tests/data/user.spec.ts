import { expect } from 'chai';
import 'mocha';

import { 
    NUM_OF_CONTACT_TELS, 
    MIN_NUM_OF_CONTACTS, 
    MAX_NUM_OF_CONTACTS } from '../../src/config/constants';

import User, { UserContact } from '../../src/data/user';

import ConstraintViolationError from '../../src/errors/contraint_violation_error';

import PasswordEncoder from '../../src/utils/password_encoder';

describe('User',
    () => {
        const sampleContacts = [
            new UserContact("firstname", "lastname", "email@mail.com", ["080", "090"])
        ];

        describe('validation test', () => {
            it('should not create a user without firstname', () => {
                const createInvalidUser = () => (
                    new User("", "m", "l","p", "q", "t", sampleContacts));
                expect(createInvalidUser).to.throw(ConstraintViolationError);
            });
    
            it('should not create a user without lastname', () => {
                const createInvalidUser = () => (
                    new User("f", "m", "","p", "q", "t", sampleContacts));
                expect(createInvalidUser).to.throw(ConstraintViolationError);
            });

            it('should not create a user without password', () => {
                const createInvalidUser = () => (
                    new User("f", "m", "l", "", "email@mail.com", "080", sampleContacts));
                expect(createInvalidUser).to.throw(ConstraintViolationError);
            });
    
            it('should not create a user without email', () => {
                const createInvalidUser = () => (
                    new User("f", "m", "l","p", "", "t", sampleContacts));
                expect(createInvalidUser).to.throw(ConstraintViolationError);
            });
    
            it('should not create a user without tel', () => {
                const createInvalidUser = () => (
                    new User("f", "m", "l", "p", "q", "", sampleContacts));
                expect(createInvalidUser).to.throw(ConstraintViolationError);
            });
    
            it('should not create a user with an invalid email', () => {
                const createInvalidUser = (email: string) => {
                    return () => (new User("f", "m", "l", "p", email, "t", sampleContacts));
                };
                expect(createInvalidUser("email")).to.throw(ConstraintViolationError);
                expect(createInvalidUser("email.com")).to.throw(ConstraintViolationError);
                expect(createInvalidUser("email@")).to.throw(ConstraintViolationError);
                expect(createInvalidUser("email@mail.com")).to.not.throw(ConstraintViolationError);
            });

            it('should not create a contact with missing details', () => {
                let tels = ["080", "090"];
                let createInvalidContact = () => new UserContact("", "lastname", "email@mail.com", tels);
                expect(createInvalidContact).to.throw(ConstraintViolationError)
                    .to.include({
                        propertyName: "Firstname", 
                        message: "Firstname is required" 
                    });
                createInvalidContact = () => new UserContact("firstname", "", "email@mail.com", tels);
                expect(createInvalidContact).to.throw(ConstraintViolationError)
                    .to.include({
                        propertyName: "Lastname", 
                        message: "Lastname is required" 
                    });
                createInvalidContact = () => new UserContact("firstname", "lastname", "", tels);
                expect(createInvalidContact).to.throw(ConstraintViolationError)
                    .to.include({
                        propertyName: "Email", 
                        message: "Email is required" 
                    });
                createInvalidContact = () => new UserContact("firstname", "lastname", "email@mail.com", undefined);
                expect(createInvalidContact).to.throw(ConstraintViolationError)
                    .to.include({
                        propertyName: "Tels", 
                        message: "Tels are required" 
                    });
            });

            it('should not create contact with incomplete or missing numbers', () => {
                let createInvalidContact = () => new UserContact(
                    "firtname", "lastname", "email@mail.com", []);
                expect(createInvalidContact).to.throw(ConstraintViolationError)
                    .to.include({
                        propertyName: "Tels",
                        message: `${NUM_OF_CONTACT_TELS} phone numbers are required`
                    });
                createInvalidContact = () => new UserContact(
                    "firtname", "lastname", "email@mail.com", ["080", ""]);
                expect(createInvalidContact).to.throw(ConstraintViolationError)
                    .to.include({
                        propertyName: "Tels",
                        message: `${NUM_OF_CONTACT_TELS} phone numbers are required`
                    });
            });

            it('should not create a contact with an invalid email', () => {
                let tels = ["080", "090"];
                let createInvalidContact = () => new UserContact(
                    "firtname", "lastname", "email", tels);
                expect(createInvalidContact).to.throw(ConstraintViolationError)
                    .to.include({
                        propertyName: "Email",
                        message: "Email is invalid"
                    });
            });

            it('should create a user contact successfully', () => {
                new UserContact(
                    "firstname", "lastname", "email@mail.com", ["080", "090"]);
            });

            it('should not add a contact that already exists', () => {
                let contact = new UserContact(
                    "firstname", "lastname", 
                    sampleContacts[0].getEmail(), 
                    ["080", "090"]);
                let user = new User("f", "m", "l", "p", "email@mail.com", "t", sampleContacts);
                let operation = () => user.addContact(contact);
                expect(operation).to.throw(ConstraintViolationError)
                    .to.include({
                        propertyName: "Contacts",
                        message: "Contact already exists"
                    });
            });

            it('should not create a user with unsupported number of contacts', () => {
                let testMinOperation = () => (
                    new User(
                        "firstname", "", "lastname",
                        "password", "user@mail.com",
                        "080", []
                    )
                );
                expect(testMinOperation).to.throw(ConstraintViolationError)
                    .to.include({
                        propertyName: "Contacts",
                        message: `At least ${MIN_NUM_OF_CONTACTS} contact(s) are required`
                    });
            });

            it('should create a user successfully', () => {
                new User("f", "m", "l", "p", "email@mail.com", "t", sampleContacts);
            });
        });
        describe('password test', () => {
            it('should hash password', async () => {
                let password: string = "password";
                let wrongPassword: string = "wrongpassword";
                let encoder = new PasswordEncoder();
                let user = new User("f", "m", "l", password, "email@g.com", "t", sampleContacts);
                await user.encodePassword();
                let hashedPassword = user.getPassword();
                let result = await encoder.comparePassword(password, hashedPassword);
                expect(result).to.equal(true);
                result = await encoder.comparePassword(wrongPassword, hashedPassword);
                expect(result).to.equal(false);
            });
        });
    });
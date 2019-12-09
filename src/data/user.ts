import { 
    NUM_OF_CONTACT_TELS, 
    MIN_NUM_OF_CONTACTS } from '../config/constants';

import ConstraintViolationError from "../errors/contraint_violation_error";

import PasswordEncoder from "../utils/password_encoder";

class User {
    public _id: Object;
    private firstName: string = "";
    private middleName: string = "";
    private lastName: string = "";
    private password: string = "";
    private email: string = "";
    private tel: string = "";
    private contacts: Array<UserContact>;

    constructor(
        firstName: string, middleName: string,
        lastName: string, password: string,
        email: string, tel: string,
        contacts: Array<UserContact>
    ) {
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.tel = tel;
        this.contacts = contacts;
        this.validateUser();
    }

    validateUser() {
        if (!checkIfExists(this.firstName)) {
            throw new ConstraintViolationError("Firstname", "Firstname is required");
        }
        if (!checkIfExists(this.lastName)) {
            throw new ConstraintViolationError("Lastname", "Lastname is required");
        }
        if (!checkIfExists(this.password)) {
            throw new ConstraintViolationError("Password", "Password is required");
        }
        if (!checkIfExists(this.email)) {
            throw new ConstraintViolationError("Email", "Email is required");
        }
        if (!checkIfExists(this.tel)) {
            throw new ConstraintViolationError("Tel", "Tel is required");
        }
        if (!checkIfValidEmail(this.email)) {
            throw new ConstraintViolationError("Email", "Email is invalid")
        }
        if (this.contacts.length < MIN_NUM_OF_CONTACTS) {
            throw new ConstraintViolationError("Contacts", 
                `At least ${MIN_NUM_OF_CONTACTS} contact(s) are required`);
        }
    }

    async encodePassword() {
        let encoder = new PasswordEncoder();
        let hash = await encoder.hashPassword(this.password);
        this.password = hash;
        return;
    }

    getId() {
        return this._id;
    }

    setId(id: Object) {
        this._id = id;
    }

    getFirstname() {
        return this.firstName;
    }

    setFirstname(firstName: string) {
        this.firstName = firstName;
    }

    getMiddlename() {
        return this.middleName;
    }

    setMiddlename(middleName: string) {
        this.middleName = middleName;
    }

    getLastname() {
        return this.lastName;
    }

    setLastname(lastName: string) {
        this.lastName = lastName;
    }

    getPassword() {
        return this.password;
    }

    setPassword(password: string) {
        this.password = password;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email: string) {
        this.email = email;
    }

    getTel() {
        return this.tel;
    }

    setTel(tel: string) {
        this.tel = tel;
    }

    addContact(contact: UserContact) {
        if (this.findContactByEmail(contact.getEmail())) {
            throw new ConstraintViolationError(
                "Contacts", "Contact already exists"
            );
        }
        this.contacts.push(contact);
    }

    private findContactByEmail(email: string) {
        return this.contacts.find((contact) => (
            contact.getEmail().toLowerCase() === email.toLowerCase()
        ));
    }

    getContacts() {
        return this.contacts;
    }

    static fromUser(user: User) {
        let userObj = new User(
            user.firstName,
            user.middleName,
            user.lastName,
            user.password,
            user.email,
            user.tel,
            user.contacts,
        );
        userObj._id = user._id;
        return userObj;
    }

}

export class UserContact {
    firstName: string;
    lastName: string;
    email: string;
    tels: Array<string>;

    constructor(firstName: string, lastName: string, 
        email: string, tels: Array<string>) { 
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.tels = tels;
            this.validate();
    }

    private validate() {
        if (!checkIfExists(this.firstName)) {
            throw new ConstraintViolationError("Firstname", "Firstname is required");
        }
        if (!checkIfExists(this.lastName)) {
            throw new ConstraintViolationError("Lastname", "Lastname is required");
        }
        if (!checkIfExists(this.email)) {
            throw new ConstraintViolationError("Email", "Email is required");
        }
        if (!checkIfValidEmail(this.email)) {
            throw new ConstraintViolationError("Email", "Email is invalid");
        }
        if (!this.tels) {
            throw new ConstraintViolationError("Tels", "Tels are required");
        }
        if (!checkIfArrayHasNElements(this.tels, NUM_OF_CONTACT_TELS)) {
            throw new ConstraintViolationError(
                "Tels", `${NUM_OF_CONTACT_TELS} phone numbers are required`);
        }
    }

    getFirstname() {
        return this.firstName;
    }

    getLastname() {
        return this.lastName;
    }

    getEmail() {
        return this.email;
    }

    getTels() {
        return this.tels;
    }
}

const checkIfArrayHasNElements = (
    val: Array<string>, numberOfElements: number) => {
        if (val.length !== numberOfElements) {
            return false;
        }
        for (let i = 0; i < val.length; i++) {
            if (!checkIfExists(val[i])) return false;
        }
        return true;
}

const checkIfExists = (val: string | undefined) => {
    if (val === null) return false;
    if (val === undefined) return false;
    if (val === "") return false;
    return true;
}

const checkIfValidEmail = (val: string) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(val.toLowerCase());
}

export default User;
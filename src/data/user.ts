import { 
    NUM_OF_CONTACT_TELS, 
    MIN_NUM_OF_CONTACTS, 
    MAX_NUM_OF_CONTACTS} from '../config/constants';

import ConstraintViolationError from "../errors/contraint_violation_error";
import ResourceNotFoundError from '../errors/resource_not_found_error';

import PasswordEncoder from "../utils/password_encoder";
import { 
    checkIfArrayHasNElements, 
    checkIfExists, 
    checkIfValidEmail } from '../utils/validators';

class User {
    public _id: Object;
    private firstName: string = "";
    private middleName: string = "";
    private lastName: string = "";
    private password: string = "";
    private email: string = "";
    private tels: Array<{ 
        tel: string, is_verified: boolean }>;
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
        this.tels = [{ tel: tel, is_verified: false }];
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
        if (!checkIfExists(this.tels[0].tel)) {
            throw new ConstraintViolationError("Tel", "Tel is required");
        }
        if (!checkIfValidEmail(this.email)) {
            throw new ConstraintViolationError("Email", "Email is invalid")
        }
        if (this.contacts.length < MIN_NUM_OF_CONTACTS) {
            throw new ConstraintViolationError("Contacts", 
                `At least ${MIN_NUM_OF_CONTACTS} contact(s) are required`);
        }
        if (this.contacts.length > MAX_NUM_OF_CONTACTS) {
            throw new ConstraintViolationError("Contacts", 
                `Only ${MAX_NUM_OF_CONTACTS} contact(s) are allowed`);
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
        return this.tels[0].tel;
    }

    setTel(tel: string) {
        this.tels[0].tel = tel;
    }

    verifyTel(tel: string) {
        // In the Future, Multiple numbers will
        // be supported, this param 'tel', will be
        // used to verify a specific number
        this.tels[0].is_verified = true;
    }

    addContact(contact: UserContact) {
        if (this.contacts.length === MAX_NUM_OF_CONTACTS) {
            throw new ConstraintViolationError(
                "Contacts", `Only ${MAX_NUM_OF_CONTACTS} contact(s) are allowed`
            );
        }
        if (this.findContactByEmail(contact.getEmail())) {
            throw new ConstraintViolationError(
                "Contacts", "Contact already exists"
            );
        }
        this.contacts.push(contact);
    }

    removeContactById(id: string) {
        if (this.contacts.length === MIN_NUM_OF_CONTACTS) {
            throw new ConstraintViolationError(
                "Contacts", `At least ${MIN_NUM_OF_CONTACTS} contact(s) are required`
            );
        }
        let contact = this.findContactById(id);
        if (contact) {
            this.contacts  = this.contacts
                .filter((value) => (value.getId() === contact.getId()));
        } else {
            throw new ResourceNotFoundError("Contact", id);
        }
    }

    private findContactById(id: string) {
        return this.contacts.find((contact) => (
            contact.getId().toString() === id
        ));
    }

    findContactByEmail(email: string) {
        return this.contacts.find((contact) => (
            contact.getEmail().toLowerCase() === email.toLowerCase()
        ));
    }

    getContacts() {
        return [...this.contacts];
    }

    static fromUser(user: User) {
        let contacts = [];
        if (user.contacts) {
            contacts = user.contacts.map(
                (contact) => UserContact.bindPrototype(contact));
        }
        let userObj: User = Object.setPrototypeOf(user, User.prototype);
        userObj.contacts = contacts;
        return userObj;
    }

}

export class UserContact {
    public _id: Object;
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

    getId() {
        return this._id;
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
        return [...this.tels];
    }

    static bindPrototype(contact): UserContact {
        return Object.setPrototypeOf(contact, UserContact.prototype);
    }
}

export default User;
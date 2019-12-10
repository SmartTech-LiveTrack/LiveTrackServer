import User from '../data/user';

class UserResponse {
    public _id: string;
    public firstname?: string;
    public middlename?: string;
    public lastname?: string;
    public email?: string;
    public tel?: string;
    public contacts?: Array<{
        _id: string,
        firstname: string,
        lastname: string,
        email: string,
        tels: Array<string>
    }>;

    constructor(user: User) {
        this._id = user._id.toString();
        this.firstname = user.getFirstname();
        this.lastname = user.getLastname();
        this.middlename = user.getMiddlename();
        this.email = user.getEmail();
        this.tel = user.getTel();
        this.contacts = user.getContacts()
            .map((contact) => ({
                _id: contact._id as string,
                firstname: contact.getFirstname(),
                lastname: contact.getLastname(),
                email: contact.getEmail(),
                tels: contact.getTels(),
            }));
    }
}

export default UserResponse;
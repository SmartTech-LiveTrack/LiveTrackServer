import User from '../data/user';

class UserResponse {
    public _id: string;
    public firstname?: string;
    public middlename?: string;
    public lastname?: string;
    public password?: string;
    public email?: string;
    public tel?: string;

    constructor(user: User) {
        this._id = user._id.toString();
        this.firstname = user.getFirstname();
        this.lastname = user.getLastname();
        this.middlename = user.getMiddlename();
        this.email = user.getEmail();
        this.tel = user.getTel();
    }
}

export default UserResponse;
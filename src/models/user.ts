export interface UserSignup {
    firstname: string;
    middlename: string;
    lastname: string;
    password: string;
    email: string;
    tel: string;
    contacts: Array<{
        firstname: string,
        lastname: string,
        email: string,
        tels: Array<string>,
    }> | undefined;
}
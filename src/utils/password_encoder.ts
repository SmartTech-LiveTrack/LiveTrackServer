import bcrypt from 'bcryptjs';

class PasswordEncoder {
    salt: string = '';
    
    constructor() {}

    async hashPassword(password: string) {
        try {
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(password, salt);
            return hash;
        } catch (e) {
            console.error("Failed to hash password");
            console.error(e);
        }
    }

    async comparePassword(password: string, hash: string) {
        try {
            return await bcrypt.compare(password, hash);
        } catch (e) {
            console.error("An error occurred while trying to compare password");
            console.error(e);
        }
    }
}

export default PasswordEncoder;
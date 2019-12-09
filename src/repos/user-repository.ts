import User from '../data/user';
import Repository from './repository';

interface UserRepository extends Repository<User> {

    findByEmail(email: String): Promise<User | undefined>;
}

export default UserRepository;
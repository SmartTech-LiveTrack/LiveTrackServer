import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';

chai.use(chaiAsPromised)
const expect = chai.expect;
const should = chai.should();

import { connect, close } from '../../src/config/db';
import User, { UserContact } from "../../src/data/user";
import { getUserService } from '../../src/use-cases';
import { getUserRepo } from '../../src/repos';
import ConstraintViolationError from '../../src/errors/contraint_violation_error';
import ResourceNotFoundError from '../../src/errors/resource_not_found_error';

const dummyUser = new User(
    "Novo",
    "middle",
    "Emma",
    "password",
    "email@mail.com",
    "tel",
    [
        new UserContact(
            "Bob",
            "Emma",
            "validcontact@mail.com",
            [
                "080", "090"
            ]
        )
    ]
);

describe('Add User Use Case', () => {
    let repo;
    let userService;

    after(async () => {
        await close();
    });

    before(async () => {
        await connect();
        repo = getUserRepo();
        userService = getUserService();
    });

    beforeEach(async () => {
        await repo.deleteAll();
    });

    describe('validation', () => {
        it('should not add a user with an existing email', async () => {
            let user = dummyUser;
            await repo.save(user);
            let operation = async () => await userService.addUser(user);
            operation().should.be.rejectedWith(ConstraintViolationError);
        });

        it('should not authenticate a user that does not exist', () => {
            let operation = async () => await userService.authenticate("email", "password");
            operation().should.be.rejectedWith(ResourceNotFoundError);
        });

        it('should not authenticate a user with incorrect password', async () => {
            let email: string = dummyUser.getEmail();
            let password: string = dummyUser.getPassword();
            let incorrectPassword: string = "wrong" + password;
            let user = dummyUser;
            user = await userService.addUser(user);
            let result: User | undefined = await userService.authenticate(
                email, incorrectPassword);
            expect(result).to.eq(undefined);
        });

        it('should not update a user\'s email', async () => {
            let email = dummyUser.getEmail();
            let newEmail = "a"+email;
            let user = dummyUser;

            let savedUser = await userService.addUser(user);
            savedUser.setEmail(newEmail);
            let updatePromise = userService.updateUser(savedUser);
            updatePromise.should.be.rejectedWith(ConstraintViolationError);
        })
    });
    
    describe('functionality', () => {
        it('should add a user', async () => {
            let user = dummyUser;
            let savedUser = await userService.addUser(user);
            let result = repo.findByEmail(savedUser.getEmail());
            expect(result).to.not.eq(undefined);
        });

        it('should authenticate a user by email and password', async () => {
            let email: string = dummyUser.getEmail();
            let password: string = dummyUser.getPassword();
            let user = dummyUser;
            user = await userService.addUser(user);
            let result: User | undefined = await userService.authenticate(email, password);
            expect(result).to.not.eq(undefined);
        });

        it('should update a user', async () => {
            let initialFirstname = dummyUser.getFirstname();
            let initialTel = dummyUser.getTel();
            let newFirstname = "a" + initialFirstname;
            let newTel = initialTel + "9";
            let user = dummyUser;
            let oldUser = await userService.addUser(user);
            user.setId(oldUser.getId());
            user.setFirstname(newFirstname);
            user.setTel(newTel);

            const verifyUpdate = (user: User) => {
                user.getFirstname().should.eq(newFirstname);
                user.getTel().should.eq(newTel);
            }

            let newUser = await userService.updateUser(user);
            verifyUpdate(newUser);
            newUser = await repo.findByEmail(newUser.getEmail());
            verifyUpdate(newUser);
        });

        it('should find a user by id', async () => {
            let email: string = dummyUser.getEmail();
            let password: string = dummyUser.getPassword();
            let user = dummyUser;
            user = await userService.addUser(user);
            let result = await userService.findUserById(user._id);
            expect(result.email).to.eq(user.getEmail());
        });

        xit('should get all users', () => {});

        xit('should delete a user', () => {});
    });
});
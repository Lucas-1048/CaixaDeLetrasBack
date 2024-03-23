import { User, IUser } from '../../src/server/models/User';
import { initializeDatabase } from '../dbHandler';

let dbHandler: any;

beforeAll(async () => {
    dbHandler = await initializeDatabase();
    dbHandler.connect();
});

afterEach(async () => await dbHandler.clearDatabase());

afterAll(async () => await dbHandler.closeDatabase());

describe('User', () => {
    test('should create a new user', async () => {
        const userData: IUser = {
            username: 'john_doe',
            email: 'john@example.com',
            password: 'password123',
            birthDate: new Date('1990-01-01'),
            gender: 'male',
            genres: ['rock', 'pop'],
        };

        const createdUser = await User.create(userData);

        expect(createdUser.username).toBe(userData.username);
        expect(createdUser.email).toBe(userData.email);
        expect(createdUser.password).toBe(userData.password);
        expect(createdUser.birthDate).toEqual(userData.birthDate);
        expect(createdUser.gender).toBe(userData.gender);
        expect(createdUser.genres).toEqual(userData.genres);
    });

    test('should not create user with duplicate username', async () => {
        const userData: IUser = {
            username: 'john_doe',
            email: 'john@example.com',
            password: 'password123',
            birthDate: new Date('1990-01-01'),
            gender: 'male',
            genres: ['rock', 'pop'],
        };

        const duplicateUser: IUser = {
            username: 'john_doe',
            email: 'notjohn@example.com',
            password: 'password123',
            birthDate: new Date('1990-01-01'),
            gender: 'male',
            genres: ['rock', 'pop'],
        };

        const createdUser = await User.create(userData);

        await expect(User.create(duplicateUser)).rejects.toThrow();
    });

    test('should not create user with duplicate email', async () => {
        const userData: IUser = {
            username: 'john_doe',
            email: 'john@example.com',
            password: 'password123',
            birthDate: new Date('1990-01-01'),
            gender: 'male',
            genres: ['rock', 'pop'],
        };

        const duplicateUser: IUser = {
            username: 'not_john_doe',
            email: 'john@example.com',
            password: 'password123',
            birthDate: new Date('1990-01-01'),
            gender: 'male',
            genres: ['rock', 'pop'],
        };

        const createdUser = await User.create(userData);

        await expect(User.create(duplicateUser)).rejects.toThrow();
    });
});

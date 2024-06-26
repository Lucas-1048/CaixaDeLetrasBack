import { User, IUser } from '../../../src/server/models/User';
import { initializeDatabase } from '../../dbHandler';

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
            profilePicturePath: 'default.jpg',
            biography: '',
            favorites: [],
        };

        const createdUser = await User.create(userData);

        expect(createdUser.username).toBe(userData.username);
        expect(createdUser.email).toBe(userData.email);
        expect(createdUser.password).toBe(userData.password);
        expect(createdUser.birthDate).toEqual(userData.birthDate);
        expect(createdUser.gender).toBe(userData.gender);
        expect(createdUser.genres).toEqual(userData.genres);
        expect(createdUser.profilePicturePath).toEqual(userData.profilePicturePath);
        expect(createdUser.biography).toEqual(userData.biography);
    });

    test('should not create user with duplicate username', async () => {
        const userData: IUser = {
            username: 'john_doe',
            email: 'john@example.com',
            password: 'password123',
            birthDate: new Date('1990-01-01'),
            gender: 'male',
            genres: ['rock', 'pop'],
            profilePicturePath: 'default.jpg',
            biography: '',
            favorites: [],
        };

        const duplicateUser: IUser = {
            username: 'john_doe',
            email: 'notjohn@example.com',
            password: 'password123',
            birthDate: new Date('1990-01-01'),
            gender: 'male',
            genres: ['rock', 'pop'],
            profilePicturePath: 'default.jpg',
            biography: '',
            favorites: [],
        };

        const createdUser = await User.create(userData);

        await User.ensureIndexes();

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
            profilePicturePath: 'default.jpg',
            biography: '',
            favorites: [],
        };

        const duplicateUser: IUser = {
            username: 'not_john_doe',
            email: 'john@example.com',
            password: 'password123',
            birthDate: new Date('1990-01-01'),
            gender: 'male',
            genres: ['rock', 'pop'],
            profilePicturePath: 'default.jpg',
            biography: '',
            favorites: [],
        };

        const createdUser = await User.create(userData);

        await User.ensureIndexes();

        await expect(User.create(duplicateUser)).rejects.toThrow();
    });

    test("Should not create user with more than 4 favorites", async () => {
        const user: IUser = {
            username: 'john_doe',
            email: 'john@example.com',
            password: 'password123',
            birthDate: new Date('1990-01-01'),
            gender: 'male',
            genres: ['rock', 'pop'],
            profilePicturePath: 'default.jpg',
            biography: '',
            favorites: [null,null,null,null,null],
        };

        await expect(User.create(user)).rejects.toThrow();
    })
});

import bcrypt from 'bcryptjs';
import { initializeDatabase } from '../../dbHandler';
import { User } from '../../../src/server/models/User'
import httpMocks from 'node-mocks-http'
import { StatusCodes } from "http-status-codes";
import { login } from '../../../src/server/controllers/Login'

let dbHandler : any

beforeAll(async () => {
    dbHandler = await initializeDatabase();
    dbHandler.connect();
});

afterEach(async () => await dbHandler.clearDatabase());

afterAll(async () => await dbHandler.closeDatabase());

describe('Credentials validation', () => {
    const userInfo = {  
        username:'abcd1234',
        email:'dce@gmail.com',
        password:'567890',
        birthDate: new Date(),
        gender: 'Male',
        genres: ['Action', 'Drama']
    }
    
    test('Trying to login with correct fields', async () => {
        process.env.JWT_SECRET = 'test';

        const user = new User({ ...userInfo, password: bcrypt.hashSync('567890') });
        await user.save();

        const request = httpMocks.createRequest({
            body: {
                email:'dce@gmail.com',
                password:'567890',
            }
        })
        const response = httpMocks.createResponse();

        await login(request, response);
        const data = response._getJSONData();

        expect(data.message).toEqual('Login successful');
        expect(response.statusCode).toBe(StatusCodes.OK);
    })

    test('Trying to login with incorrect email', async () => {
        process.env.JWT_SECRET = 'test';
        
        const user = new User({ ...userInfo, password: bcrypt.hashSync('567890') });
        await user.save();

        const request = httpMocks.createRequest({
            body: {
                email:'dce@gmail.co',
                password:'567890',
            }
        })
        const response = httpMocks.createResponse();

        await login(request, response);
        const data = response._getJSONData();

        expect(data.message).toEqual('Invalid email or password');
        expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    })

    test('Trying to login with incorrect password', async () => {
        process.env.JWT_SECRET = 'test';
        
        const user = new User({ ...userInfo, password: bcrypt.hashSync('567890') });
        await user.save();

        const request = httpMocks.createRequest({
            body: {
                email:'dce@gmail.com',
                password:'5678900',
            }
        })
        const response = httpMocks.createResponse();

        await login(request, response);
        const data = response._getJSONData();

        expect(data.message).toEqual('Invalid email or password');
        expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    })
});
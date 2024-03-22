import { initializeDatabase } from '../../dbHandler';
import { User } from '../../../src/server/models/User'
import * as SignUpMiddleware from '../../../src/server/middleware/VerifySignUp'
import httpMocks from 'node-mocks-http'
import { StatusCodes } from "http-status-codes";


let dbHandler : any

beforeAll(async () => {
    dbHandler = await initializeDatabase();
    dbHandler.connect();
});

afterEach(async () => await dbHandler.clearDatabase());

afterAll(async () => await dbHandler.closeDatabase());

describe('Duplicate checking', () => {
    test('Trying to signup already existing username', async () => {
        const request = httpMocks.createRequest({
            body: {
                user:'abcd1234',
                email:'dce@gmail.com',
                password:'567890',
                birthDate: new Date(),
                gender: 'Male',
                genres: ['Action', 'Drama']
            }
        })
        const response = httpMocks.createResponse()
        const next = jest.fn()

        const user = new User({user: 'abcd1234', email:'abc@gmail.com', password:'123456', birthDate: new Date(), gender:'Female', genres:['Romance', 'Comedy']});
        await user.save();

        await SignUpMiddleware.VerifySignUp.checkDuplicateUsername(request, response, next)
        const data = response._getJSONData()

        expect(data.message).toEqual('username already registered')
        expect(next).not.toHaveBeenCalled()
        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
    })
})


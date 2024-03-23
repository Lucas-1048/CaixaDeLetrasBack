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

const validUser = {
    user: '1234',
    email: 'a@gmail.com',
    password: '123456',
}

describe('Duplicate checking', () => {
    const next = jest.fn()
    test('Try to signup already existing username', async () => {
        const user = new User(validUser);
        await user.save()

        const request = httpMocks.createRequest({
            body: {
                ...validUser,
                email:'bb@gmail.com'
            }
        })
        const response = httpMocks.createResponse()

        await SignUpMiddleware.checkDuplicateUsername(request, response, next)
        const data = response._getJSONData()

        expect(data.message).toEqual('username already registered')
        expect(next).not.toHaveBeenCalled()
        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
    })

    test('Try to signup already existing email', async () => {
        const user = new User(validUser);
        await user.save()
        const request = httpMocks.createRequest({
            body : {
                ...validUser,
                user: 'adddddd'
            }
        })
        const response = httpMocks.createResponse()
        const next = jest.fn()

        await SignUpMiddleware.checkDuplicateEmail(request, response, next)
        const data = response._getJSONData()

        expect(data.message).toEqual('e-mail already registered')
        expect(next).not.toHaveBeenCalled()
        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
    })

    test('Try to signup non-existing username and email', async () => {
        const request = httpMocks.createRequest({
            body: validUser
        })
        const response = httpMocks.createResponse()

        await SignUpMiddleware.checkDuplicateUsername(request, response, next)

        expect(next).toHaveBeenCalled()
    })
})

describe('Correct input validation', () => {
    const next = jest.fn()

    test('Invalid e-mail', async () => {
        const req = httpMocks.createRequest({
            body: {
                ...validUser,
                email: 'aa1234',
            }
        })
        const res = httpMocks.createResponse()

        await SignUpMiddleware.signUpBodyValidator(req, res, next)
        const data = res._getJSONData()

        expect(next).not.toHaveBeenCalled()        
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
        expect(data.errors.email).toEqual('email must be a valid email')
    }) 

    test('Short username', async () => {
        const req = httpMocks.createRequest({
            body: {
                ...validUser,
                user: '123'
            }
        })
        const res = httpMocks.createResponse()

        await SignUpMiddleware.signUpBodyValidator(req, res, next)
        const data = res._getJSONData()

        expect(next).not.toHaveBeenCalled()        
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
        expect(data.errors.user).toEqual('user must be at least 4 characters')
    })

    test('Long username', async () => {
        const req = httpMocks.createRequest({
            body: {
                ...validUser,
                user: '123456789012345678901'
            }
        })
        const res = httpMocks.createResponse()

        await SignUpMiddleware.signUpBodyValidator(req, res, next)
        const data = res._getJSONData()

        expect(next).not.toHaveBeenCalled()        
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
        expect(data.errors.user).toEqual('user must be at most 20 characters')
    })

    test('Short password', async () => {
        const req = httpMocks.createRequest({
            body: {
                ...validUser,
                password: '12345'
            }
        })
        const res = httpMocks.createResponse()

        await SignUpMiddleware.signUpBodyValidator(req, res, next)
        const data = res._getJSONData()

        expect(next).not.toHaveBeenCalled()        
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
        expect(data.errors.password).toEqual('password must be at least 6 characters')
    })

    test('Valid user', async () => {
        const req = httpMocks.createRequest({
            body: validUser
        })
        const res = httpMocks.createResponse()

        await SignUpMiddleware.signUpBodyValidator(req, res, next)

        expect(next).toHaveBeenCalled()        
    })
})


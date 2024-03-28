import { initializeDatabase } from '../../dbHandler';
import { User } from '../../../src/server/models/User'
import { VerifySignUp } from '../../../src/server/middleware/VerifySignUp'
import { bodyValidation } from '../../../src/server/middleware/BodyValidation'
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
    username: '1234',
    email: 'a@gmail.com',
    password: '123456',
    birthDate: new Date(),
    gender: 'Male',
    genres: ['Action', 'Drama'],
    favorites: [],
}

const bodyValidator = bodyValidation(VerifySignUp.signUpValidation)

describe('Duplicate checking', () => {
    const next = jest.fn()
    test('Should not signup already existing username', async () => {
        const user = new User(validUser);
        await user.save()

        const request = httpMocks.createRequest({
            body: {
                ...validUser,
                email:'bb@gmail.com'
            }
        })
        const response = httpMocks.createResponse()
        const next = jest.fn()

        await VerifySignUp.checkDuplicateUsername(request, response, next)
        const data = response._getJSONData()

        expect(data.error).toEqual('Username already registered')
        expect(next).not.toHaveBeenCalled()
        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
    })

    test('Should not signup already existing email', async () => {
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

        await VerifySignUp.checkDuplicateEmail(request, response, next)
        const data = response._getJSONData()

        expect(data.error).toEqual('E-mail already registered')
        expect(next).not.toHaveBeenCalled()
        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
    })

    test('Should signup non-existing username and email', async () => {
        const request = httpMocks.createRequest({
            body: validUser
        })
        const response = httpMocks.createResponse()

        await VerifySignUp.checkDuplicateUsername(request, response, next)

        expect(next).toHaveBeenCalled()
    })
})

describe('Correct input validation', () => {
    const next = jest.fn()

    test('Should not accept invalid e-mail', async () => {
        const req = httpMocks.createRequest({
            body: {
                ...validUser,
                email: 'aa1234',
            }
        })
        const res = httpMocks.createResponse()

        await bodyValidator(req, res, next)
        const data = res._getJSONData()

        expect(next).not.toHaveBeenCalled()        
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
        expect(data.errors.email).toEqual('email must be a valid email')
    }) 

    test('Should not accept short username', async () => {
        const req = httpMocks.createRequest({
            body: {
                ...validUser,
                username: '123'
            }
        })
        const res = httpMocks.createResponse()

        await bodyValidator(req, res, next)
        const data = res._getJSONData()

        expect(next).not.toHaveBeenCalled()        
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
        expect(data.errors.username).toEqual('username must be at least 4 characters')
    })

    test('Should not accept long username', async () => {
        const req = httpMocks.createRequest({
            body: {
                ...validUser,
                username: '123456789012345678901'
            }
        })
        const res = httpMocks.createResponse()

        await bodyValidator(req, res, next)
        const data = res._getJSONData()

        expect(next).not.toHaveBeenCalled()        
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
        expect(data.errors.username).toEqual('username must be at most 20 characters')
    })

    test('Should not accept short password', async () => {
        const req = httpMocks.createRequest({
            body: {
                ...validUser,
                password: '12345'
            }
        })
        const res = httpMocks.createResponse()

        await bodyValidator(req, res, next)
        const data = res._getJSONData()

        expect(next).not.toHaveBeenCalled()        
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
        expect(data.errors.password).toEqual('password must be at least 6 characters')
    })

    test('Should accept valid user', async () => {
        const req = httpMocks.createRequest({
            body: validUser
        })
        const res = httpMocks.createResponse()

        await bodyValidator(req, res, next)

        expect(next).toHaveBeenCalled()        
    })
})


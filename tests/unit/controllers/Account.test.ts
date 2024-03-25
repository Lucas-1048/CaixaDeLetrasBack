import { initializeDatabase } from '../../dbHandler';
import { StatusCodes } from "http-status-codes";
import { accountHandler } from "../../../src/server/controllers/Account";
import { Checks } from '../../../src/server/middleware/Checks';
import { User } from "../../../src/server/models/User";
import httpMocks from "node-mocks-http";

let dbHandler : any;
let next : any;
let res : any;

beforeAll(async () => {
    dbHandler = await initializeDatabase();
    dbHandler.connect();

    res = httpMocks.createResponse();
    next = jest.fn();
});

afterEach(async () => {
    await dbHandler.clearDatabase();
    res = httpMocks.createResponse();
    next = jest.fn();
});

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

describe("GET methods", () => {
    test("Trying to retreive all acount info", async () => {
        const user = new User(validUser);
        await user.save();

        const req = httpMocks.createRequest({
            params: {
                id: user._id,
            }
        });

        res.locals.user = user; //Assume user is in locals with middleware

        await accountHandler.getAccountInfo(req, res);        

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res._getJSONData()._id).toBe(String(user._id));
    });
});

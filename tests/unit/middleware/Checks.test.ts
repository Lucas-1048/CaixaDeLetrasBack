import { initializeDatabase } from '../../dbHandler';
import { User } from '../../../src/server/models/User';
import { Movie } from '../../../src/server/models/Movie';
import { Checks } from '../../../src/server/middleware/Checks';
import httpMocks from 'node-mocks-http';
import { StatusCodes } from "http-status-codes";


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

const validMovie = {
    title: 'Timmy Failure: Mistakes Were Made',
    year: 2020,
    cast: [
      'Winslow Fegley',
      'Ophelia Lovibond',
      'Craig Robinson',
      'Wallace Shawn'
    ],
    genres: [ 'Adventure', 'Comedy', 'Drama', 'Family', 'Fantasy' ],
    extract: 'Timmy Failure: Mistakes Were Made is a 2020 American adventure fantasy comedy-drama family film based on the book series of the same name by Stephan Pastis that debuted on Disney+ on February 7, 2020. The film is directed by Tom McCarthy, produced by Alexander Dostal, McCarthy and Jim Whitaker from a screenplay written by McCarthy and Pastis and stars Winslow Fegley, Ophelia Lovibond, Craig Robinson and Wallace Shawn.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/c/c8/Timmy_Failure_Mistakes_Were_Made_Poster.jpeg',
}

describe("Parameter checks", () => {
    test("Should reject non-existing user ID", async () => {
        const req = httpMocks.createRequest({
            params: {
                idUser: '65ff690c34e350de1d4acf02',
            }
        });

        await Checks.checkParamUserId(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    test("Should reject non-existing movie ID", async () => {
        const req = httpMocks.createRequest({
            params: {
                idMovie: '6601e3284be11204fb527866',
            }
        });

        await Checks.checkParamMovieId(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    test("Should reject non-existing username", async () => {
        const req = httpMocks.createRequest({
            params: {
                username: 'aaaa',
            }
        });

        await Checks.checkQueryUsername(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    })

    test("Should reject invalid user ID format", async () => {
        const req = httpMocks.createRequest({
            params: {
                idUser: 'dasda',
            }
        });

        await Checks.checkParamUserId(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    test("Should reject invalid movie ID format", async() => {
        const req = httpMocks.createRequest({
            params: {
                idMovie: 'dasda',
            }
        });

        await Checks.checkParamMovieId(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    test("Should accept existing user ID", async() => {
        const user = new User(validUser);
        await user.save();

        const req = httpMocks.createRequest({
            params: {
                idUser: user._id,
            }
        });

        await Checks.checkParamUserId(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.locals.user._id).toStrictEqual(user._id);
    });

    test('Should accept existing movie ID', async() => {
        const movie = new Movie(validMovie);
        await movie.save();

        const req = httpMocks.createRequest({
            params: {
                idMovie: movie._id,
            }
        });

        await Checks.checkParamMovieId(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.locals.movie._id).toStrictEqual(movie._id);
    })

    test('Should accept existing username', async () => {
        const user = new User(validUser);
        await user.save();
        
        const req = httpMocks.createRequest({
            query: {
                username: user.username,
            }
        });

        await Checks.checkQueryUsername(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.locals.user._id).toStrictEqual(user._id);
    })
});

describe("Body checks", () => {
    test("Should reject for non-existing movie ID", async () => {
        const req = httpMocks.createRequest({
            body: {
                movieId: '65ff690c34e350de1d4acf02',
            }
        });

        await Checks.checkBodyMovieId(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    test("Should reject invalid movie ID format", async () => {
        const req = httpMocks.createRequest({
            body: {
                movieId: 'dasda',
            }
        });

        await Checks.checkBodyMovieId(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    test("Should accept valid movie ID", async () => {
        const movie = new Movie(validMovie);
        await movie.save();

        const req = httpMocks.createRequest({
            body: {
                movieId: movie._id,
            }
        });

        await Checks.checkBodyMovieId(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.locals.movie._id).toStrictEqual(movie._id);
    });
});
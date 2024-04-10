import { initializeDatabase } from '../../dbHandler';
import { User } from '../../../src/server/models/User';
import { Movie } from '../../../src/server/models/Movie';
import { Review } from '../../../src/server/models/Review';
import httpMocks from 'node-mocks-http';
import { StatusCodes } from "http-status-codes";
import { reviewHandler } from '../../../src/server/controllers/Review';


let dbHandler : any;
let next : any;
let res : any;
let user : any;
let movie : any;

beforeAll(async () => {
    dbHandler = await initializeDatabase();
    dbHandler.connect();

    res = httpMocks.createResponse();
    next = jest.fn();

    user = new User(validUser);
    await user.save();
    res.locals.user = user;

    movie = new Movie(validMovie);
    await movie.save();
    res.locals.movie = movie;
});

afterEach(async () => {
    await dbHandler.clearDatabase();
    res = httpMocks.createResponse();
    next = jest.fn();

    user = new User(validUser);
    await user.save();
    res.locals.user = user;

    movie = new Movie(validMovie);
    await movie.save();
    res.locals.movie = movie;
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

const validReview = {
    review: "mto foda",
    rating: 4,
}

describe("Incorrect/Missing fields for POST/PUT review", () => {
    test("should not accept missing review field", async () => {
        const req = httpMocks.createRequest({
            body: {
                ...validReview,
                review: '',
            }
        });

        await reviewHandler.createReview(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(await Review.findOne({})).toBe(null);
    });

    test("should not accept missing rating field", async () => {
        const req = httpMocks.createRequest({
            body: {
                review: 'mto foda',
            }
        });

        await reviewHandler.createReview(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(await Review.findOne({})).toBe(null);
    });

    test("should not accept out-of-bounds (above) rating field", async () => {
        const req = httpMocks.createRequest({
            body: {
                ...validReview,
                rating: 5.5
            }
        });

        await reviewHandler.createReview(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(await Review.findOne({})).toBe(null);
    });

    test("should not accept out-of-bounds (below) rating field", async () => {
        const req = httpMocks.createRequest({
            body: {
                ...validReview,
                rating: -0.1,
            }
        });

        await reviewHandler.createReview(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(await Review.findOne({})).toBe(null);
    });
});

describe("General review create/update/delete rules", () => {
    test("should not accept new review when user already has one of a same movie", async () => {
        const req = httpMocks.createRequest({
            body: validReview
        });

        await reviewHandler.createReview(req, res, next);
        
        res = httpMocks.createResponse();
        res.locals.user = user;
        res.locals.movie = movie;

        await reviewHandler.createReview(req, res, next);

        expect(next).not.toHaveBeenCalled()
        expect((await Review.find({})).length).toBe(1);
        expect(res.statusCode).toBe(StatusCodes.CONFLICT);
    });

    test("should post a review, then modify it", async () => {
        let req = httpMocks.createRequest({
            body: validReview
        });

        await reviewHandler.createReview(req, res, next);

        req = httpMocks.createRequest({
            body: {
                review: "mto legal",
                rating: 0,
            }
        });
        
        res = httpMocks.createResponse();
        res.locals.user = user;
        res.locals.movie = movie;

        await reviewHandler.putReview(req, res, next);

        const query = await Review.find({});

        expect(next).not.toHaveBeenCalled()
        expect(query.length).toBe(1);
        expect(query[0].review).toBe(req.body.review);
        expect(query[0].rating).toBe(req.body.rating);
        expect(res.statusCode).toBe(StatusCodes.CREATED);
    });

    test("should remove a review", async () => {
        const req = httpMocks.createRequest({
            body: validReview
        });

        await reviewHandler.createReview(req, res, next);
        
        res = httpMocks.createResponse();
        res.locals.user = user;
        res.locals.movie = movie;

        await reviewHandler.removeReview(req, res, next);

        expect(next).not.toHaveBeenCalled()
        expect((await Review.find({})).length).toBe(0);
        expect(res.statusCode).toBe(StatusCodes.NO_CONTENT);
    });

    test("should still return 204 even if review does not exist", async () => {
        const req = httpMocks.createRequest({});

        await reviewHandler.removeReview(req, res, next);

        expect(res.statusCode).toBe(StatusCodes.NO_CONTENT);
        expect(next).not.toHaveBeenCalled()
    });
})
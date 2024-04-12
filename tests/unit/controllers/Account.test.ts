import { initializeDatabase } from '../../dbHandler';
import { StatusCodes } from "http-status-codes";
import { accountHandler } from "../../../src/server/controllers/Account";
import { IUser, User } from "../../../src/server/models/User";
import { Movie } from '../../../src/server/models/Movie';
import httpMocks from "node-mocks-http";
import { pictureHandler } from '../../../src/server/controllers/Avatar';
import { movies } from '../../validDocuments';
import { Review } from '../../../src/server/models/Review';
import { randomInt } from 'crypto';

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

jest.mock('./../../../src/server/controllers/Avatar', () => ({
    pictureHandler: {
        getAvatar: jest.fn(),
    }
}));

const validUser = {
    username: '1234',
    email: 'a@gmail.com',
    password: '123456',
    birthDate: new Date(),
    gender: 'Male',
    genres: ['Action', 'Drama'],
    favorites: [],
    biography: 'Test',
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
    extract: `Timmy Failure: Mistakes Were Made is a 2020 American adventure fantasy comedy-drama family film
     based on the book series of the same name by Stephan Pastis that debuted on Disney+ on February 7, 2020. 
     The film is directed by Tom McCarthy, produced by Alexander Dostal, McCarthy and Jim Whitaker from a screenplay
     written by McCarthy and Pastis and stars Winslow Fegley, Ophelia Lovibond, Craig Robinson and Wallace Shawn.`,
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/c/c8/Timmy_Failure_Mistakes_Were_Made_Poster.jpeg',
}

describe ("Get methods", () => {
    it('Deve retornar os dados do usuário privado em JSON', async () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();

        const user = new User (validUser);
        await user.save();

        await User.findById(user._id).populate('favorites').exec();

        res.locals.user = user;

        await accountHandler.getPrivateAccount(req, res);

        const responseData = JSON.parse(res._getData());
        expect(responseData).toEqual({
            username: user.username,
            email: user.email,
            birthDate: user.birthDate.toISOString(),
            gender: user.gender,
            genres: user.genres,
            profilePicturePath: user.profilePicturePath,
            biography: user.biography,
            favorites: user.favorites
        });
    });

    it('Should return public user data in JSON', async () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();

        const user = new User(validUser);
        await user.save();

        await User.findById(user._id).populate('favorites').exec();

        res.locals.user = user;

        await accountHandler.getPublicAccount(req, res);

        const responseData = JSON.parse(res._getData());
        expect(responseData).toEqual({
            username: user.username,
            gender: user.gender,
            biography: user.biography,
            favorites: user.favorites
        })
    });

    it('should get user reviews', async () => {
        await Movie.insertMany(movies);
        const dbMovies = await Movie.find();

        const user = new User (validUser);
        await user.save();

        await Movie.ensureIndexes();
        await User.ensureIndexes();
        
        for (let i = 0; i < 20; i++) {
            const validReview = new Review({
                user: user._id,
                movie: dbMovies[i]._id,
                review: 'It surely is one of the movies ever.',
                rating: randomInt(0, 5)
            });

            await validReview.save();
        }

        await Review.ensureIndexes();

        let req = httpMocks.createRequest({
            params: {
                idUser: user._id,
            }
        });
        res.locals.user = user;

        await accountHandler.getReviews(req, res);
        
        let data = res._getJSONData();
        
        expect(res.statusCode).toBe(StatusCodes.OK);

        for (let i = 9; i <= 0; i++) {
            expect(data.reviews[i].movie.thumbnail).toBe(dbMovies[i].thumbnail);
            expect(data.reviews[i].movie.title).toBe(String(dbMovies[i].title));
        }

        expect(data.reviews.length).toBe(10);
        expect(data.page.currentPage).toBe(1);
        expect(data.page.totalPages).toBe(2);
        expect(data.page.size).toBe(10);

        req = httpMocks.createRequest({
            params: {
                idUser: user._id,
            },
            body: {
                page: 9,
                limit: 2
            }
        });
        res = httpMocks.createResponse();
        res.locals.user = user;

        await accountHandler.getReviews(req, res);
        
        data = res._getJSONData();

        expect(data.page.currentPage).toBe(9);
        expect(data.page.totalPages).toBe(10);
        expect(data.page.size).toBe(2);
    });
});

describe("Delete methods", () => {
    test("Should delete user", async () => {
        const user = new User(validUser);
        await user.save();

        const req = httpMocks.createRequest();

        res.locals.user = user;
        await accountHandler.deleteAccount(req, res);

        expect(res.statusCode).toBe(StatusCodes.NO_CONTENT);

        const deletedUser = await User.findById(user._id);
        expect(deletedUser).toBe(null);
    });
    
    test("Should delete a favorite movie", async () => {
        const user = new User(validUser);
        await user.save();
        const movie = new Movie(validMovie);
        await movie.save();

        const req = httpMocks.createRequest();

        res.locals.user = user;
        res.locals.movie = movie;
        await accountHandler.setFavorite(req, res);

        res = httpMocks.createResponse();
        res.locals.user = user;

        const req2 = httpMocks.createRequest({
            query: {
                pos: '0',
            }
        });
        
        await accountHandler.removeFavorite(req2, res);

        expect(res.statusCode).toBe(StatusCodes.NO_CONTENT);

        res = httpMocks.createResponse();
        res.locals.user = user;
        await accountHandler.getPublicAccount(req, res);
        const data = res._getJSONData();

        expect(data.favorites.length).toBe(0);
    });
});

describe("Update methods", () => {
    test("Should update biography", async () => {
        const user = new User(validUser);
        await user.save();

        const req = httpMocks.createRequest({
            body: {
                biography: 'abc123',
            }
        });

        res.locals.user = user;
        await accountHandler.updateBio(req, res);

        expect(res.statusCode).toBe(StatusCodes.NO_CONTENT);

        res = httpMocks.createResponse();
        res.locals.user = user;
        await accountHandler.getPublicAccount(req, res);
        const data = res._getJSONData();

        expect(data.biography).toEqual(req.body.biography);
    });

    test("Should set favorite", async () => {
        const user = new User(validUser);
        await user.save();
        const movie = new Movie(validMovie);
        await movie.save();

        const req = httpMocks.createRequest();

        res.locals.user = user;
        res.locals.movie = movie;
        await accountHandler.setFavorite(req, res);

        expect(res.statusCode).toBe(StatusCodes.OK);

        res = httpMocks.createResponse();
        res.locals.user = user;
        await accountHandler.getPublicAccount(req, res);
        const data = res._getJSONData();

        expect(String(data.favorites[0]._id)).toEqual(String(movie._id));
    });

    test("Should reject setting favorite if user already has 4 favorites", async () => {
        const user = new User(validUser);
        await user.save();
        const movie = new Movie(validMovie);
        await movie.save();

        const req = httpMocks.createRequest();

        res.locals.user = user;
        res.locals.movie = movie;
        await accountHandler.setFavorite(req, res);

        res.locals.user = user;
        res.locals.movie = movie;
        await accountHandler.setFavorite(req, res);

        res.locals.user = user;
        res.locals.movie = movie;
        await accountHandler.setFavorite(req, res);

        res.locals.user = user;
        res.locals.movie = movie;
        await accountHandler.setFavorite(req, res);

        res.locals.user = user;
        res.locals.movie = movie;
        await accountHandler.setFavorite(req, res);

        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    test("Should update favorite", async () => {
        const user = new User(validUser);
        await user.save();
        const movie = new Movie(validMovie);
        await movie.save();

        const req1 = httpMocks.createRequest();

        res.locals.user = user;
        res.locals.movie = movie;
        await accountHandler.setFavorite(req1, res);

        const req2 = httpMocks.createRequest({
            query: {
                pos: '0',
            }
        });
        await accountHandler.updateFavorite(req2, res);

        expect(res.statusCode).toBe(StatusCodes.NO_CONTENT);

        res = httpMocks.createResponse();
        res.locals.user = user;
        await accountHandler.getPublicAccount(req2, res);
        let data = res._getJSONData();

        expect(data.favorites[0]._id).toEqual(String(movie._id));
    });

    test("Should reject updating favorites on position >= 4", async () => {
        const user = new User(validUser);
        await user.save();
        const movie = new Movie(validMovie);
        await movie.save();

        const req = httpMocks.createRequest({
            params: {
                pos: '4',
            }
        });

        res.locals.user = user;
        res.locals.movie = movie;
        await accountHandler.updateFavorite(req, res);

        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    test("Should reject updating favorites on position < 0", async () => {
        const user = new User(validUser);
        await user.save();
        const movie = new Movie(validMovie);
        await movie.save();

        const req = httpMocks.createRequest({
            params: {
                pos: '-1',
            }
        });

        res.locals.user = user;
        res.locals.movie = movie;
        await accountHandler.updateFavorite(req, res);

        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
}); 
import { movieHandler } from '../../../src/server/controllers/Movie';
import { initializeDatabase } from '../../dbHandler';
import { Movie } from '../../../src/server/models/Movie';
import httpMocks from 'node-mocks-http';
import { StatusCodes } from "http-status-codes";
import { checkServerIdentity } from 'tls';
import { movie, users } from '../../validDocuments';
import { User } from '../../../src/server/models/User';
import { Review } from '../../../src/server/models/Review';
import { randomInt } from 'crypto';

let dbHandler : any;

let req: any;
let res: any;

beforeAll(async () => {
    dbHandler = await initializeDatabase();
    dbHandler.connect();

    req = httpMocks.createRequest();
    res = httpMocks.createResponse();

    await Movie.insertMany(validMovies);
    await Movie.ensureIndexes();
});

afterAll(async () => await dbHandler.closeDatabase());

const validMovies = [
    {
        title: 'The Shawshank Redemption',
        year: 1994,
        cast: ['Tim Robbins', 'Morgan Freeman'],
        genres: ['Drama'],
    },
    {
        title: 'The Godfather',
        year: 1972,
        cast: ['Marlon Brando', 'Al Pacino'],
        genres: ['Crime', 'Drama'],
    },
    {
        title: 'Inception',
        year: 2010,
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
        genres: ['Action', 'Sci-Fi'],
    },
    {
        title: 'Pulp Fiction',
        year: 1994,
        cast: ['John Travolta', 'Samuel L. Jackson'],
        genres: ['Crime', 'Drama'],
    }
]

describe('genres', () => {
    it('should return all genres', async () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();

        await movieHandler.genres(req, res);

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res._getJSONData().genres.sort()).toEqual(['Drama', 'Crime', 'Action', 'Sci-Fi'].sort());
    });
});

describe('getMovie', () => {
    it('should return the movie', async () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();

        const movie = (await Movie.find({ title: 'The Shawshank Redemption' }))[0];

        req.params.idMovie = movie._id.toString();
        res.locals.movie = movie;

        movieHandler.getMovie(req, res);

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res._getJSONData().title).toBe('The Shawshank Redemption');
        expect(res._getJSONData().year).toBe(1994);
        expect(res._getJSONData().cast).toEqual(['Tim Robbins', 'Morgan Freeman']);
        expect(res._getJSONData().genres).toEqual(['Drama']);

        // For some reason it is not possible to compare the movie json directly
    });

    // There's no need for testing a case where the movie doesn't exist, as the middleware
    // checkParamMovieId already covers this case and is the only responsible for 
    // returning a 404 status.
});

describe('getReviews', () => {
    it('should return the reviews', async () => {

        await User.insertMany(users);
        
        const dbMovie = new Movie(movie);

        await Movie.ensureIndexes();
        await User.ensureIndexes();

        const dbUsers = await User.find({});
        
        for (let i = 0; i < 20; i++) {
            const validReview = new Review({
                user: dbUsers[i]._id,
                movie: dbMovie._id,
                review: 'It surely is one of the movies ever.',
                rating: randomInt(1, 5),
            });

            await validReview.save();
        }

        await Review.ensureIndexes();

        let req = httpMocks.createRequest({
            params: {
                idMovie: dbMovie._id,
            }
        });
        res.locals.movie = dbMovie;

        await movieHandler.getReviews(req, res);

        let data = res._getJSONData();

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(data.reviews.length).toBe(10);
        expect(data.page.currentPage).toBe(1);

        expect(data.reviews[0].username).toBe(dbUsers[19].username);

        req = httpMocks.createRequest({
            params: {
                idMovie: dbMovie._id,
            },
            body: {
                page: 2,
                limit: 3,
            }
        });
        res = httpMocks.createResponse();
        res.locals.movie = dbMovie;

        await movieHandler.getReviews(req, res);

        data = res._getJSONData();

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(data.reviews.length).toBe(3);
        expect(data.page.currentPage).toBe(2);
        expect(data.page.totalPages).toBe(7);
        expect(data.page.size).toBe(3);
    });

    it('should return an empty array if there are no reviews', async () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();

        const movie = (await Movie.find({ title: 'The Godfather' }))[0];

        req.params.idMovie = movie._id.toString();
        res.locals.movie = movie;
        req.body = { page: 1 };

        await movieHandler.getReviews(req, res);

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res._getJSONData().reviews.length).toBe(0);
        expect(res._getJSONData().page.currentPage).toBe(1);
        expect(res._getJSONData().page.totalPages).toBe(0);
        expect(res._getJSONData().page.size).toBe(0);
    });

    // There's no need for testing a case where the movie doesn't exist, as the middleware
    // checkParamMovieId already covers this case and is the only responsible for 
    // returning a 404 status.
});


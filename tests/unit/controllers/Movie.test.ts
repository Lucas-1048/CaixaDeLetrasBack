import { movieHandler } from '../../../src/server/controllers/Movie';
import { initializeDatabase } from '../../dbHandler';
import { Movie } from '../../../src/server/models/Movie';
import httpMocks from 'node-mocks-http';
import { StatusCodes } from "http-status-codes";

let dbHandler : any;

beforeAll(async () => {
    dbHandler = await initializeDatabase();
    dbHandler.connect();

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

        const movie = await Movie.find({ title: 'The Shawshank Redemption' });

        req.params.idMovie = movie[0]._id.toString();

        movieHandler.getMovie(req, res);

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res._getJSONData()).toEqual(movie);
    });

    // There's no need for testing a case where the movie doesn't exist, as the middleware
    // checkParamMovieId already covers this case and is the only responsible for 
    // returning a 404 status.
});


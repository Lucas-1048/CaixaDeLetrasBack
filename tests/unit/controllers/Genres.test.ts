import { genres } from '../../../src/server/controllers/Genres';
import { initializeDatabase } from '../../dbHandler';
import { Movie } from '../../../src/server/models/Movie';
import httpMocks from 'node-mocks-http';
import { StatusCodes } from "http-status-codes";

let dbHandler : any;

beforeAll(async () => {
    dbHandler = await initializeDatabase();
    dbHandler.connect();

    await Movie.insertMany(validMovies);
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

describe('Genres Controller', () => {
    it('should return all genres', async () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();

        await genres(req, res);

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res._getJSONData().genres.sort()).toEqual(['Drama', 'Crime', 'Action', 'Sci-Fi'].sort());
    });
});


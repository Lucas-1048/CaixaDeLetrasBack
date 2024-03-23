import { initializeDatabase } from '../dbHandler';
import { Movie, IMovie } from '../../src/server/models/Movie'

let dbHandler : any

beforeAll(async () => {
    dbHandler = await initializeDatabase();
    dbHandler.connect();
});

afterEach(async () => await dbHandler.clearDatabase());

afterAll(async () => await dbHandler.closeDatabase());

describe('Movie', () => {
    test('should create a movie', async () => {
        const movieData: IMovie = {
            title: 'The Shawshank Redemption',
            year: 1994,
            cast: ['Tim Robbins', 'Morgan Freeman'],
            genres: ['Drama'],
            extract: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
            thumbnail: 'https://example.com/thumbnail.jpg',
        };

        const createdMovie = await Movie.create(movieData);

        expect(createdMovie).toBeDefined();
        expect(createdMovie.title).toBe(movieData.title);
        expect(createdMovie.year).toBe(movieData.year);
        expect(createdMovie.cast).toEqual(movieData.cast);
        expect(createdMovie.genres).toEqual(movieData.genres);
        expect(createdMovie.extract).toBe(movieData.extract);
        expect(createdMovie.thumbnail).toBe(movieData.thumbnail);
    });

    test('should find a movie', async () => {
        const movieData: IMovie = {
            title: 'The Shawshank Redemption',
            year: 1994,
            cast: ['Tim Robbins', 'Morgan Freeman'],
            genres: ['Drama'],
            extract: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
            thumbnail: 'https://example.com/thumbnail.jpg',
        };

        await Movie.create(movieData);

        const foundMovie = await Movie.findOne({ title: movieData.title });

        expect(foundMovie).toBeDefined();
        expect(foundMovie!.title).toBe(movieData.title);
        expect(foundMovie!.year).toBe(movieData.year);
        expect(foundMovie!.cast).toEqual(movieData.cast);
        expect(foundMovie!.genres).toEqual(movieData.genres);
        expect(foundMovie!.extract).toBe(movieData.extract);
        expect(foundMovie!.thumbnail).toBe(movieData.thumbnail);
    });
});

import { initializeDatabase } from '../../dbHandler';
import { Movie } from '../../../src/server/models/Movie';
import httpMocks from 'node-mocks-http';
import { StatusCodes } from "http-status-codes";
import { searchMovie } from '../../../src/server/controllers/SearchMovie';
import { movies } from '../../validDocuments';
import exp from 'constants'; // Remover

let dbHandler : any;

beforeAll(async () => {
    dbHandler = await initializeDatabase();
    dbHandler.connect();

    await Movie.insertMany(movies);
});

afterAll(async () => await dbHandler.closeDatabase());

describe('SearchMovie Controller', () => {
    it('should return all movies that contain the query in their title', async () => {
        const req = httpMocks.createRequest({
            body: {
                title: 'The',
                limit: 100
            }
        });
        const res = httpMocks.createResponse();

        await searchMovie(req, res);

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res._getJSONData().movies.length).toBe(74);
        expect(res._getJSONData().page.totalPages).toBe(1);
        expect(res._getJSONData().page.size).toBe(74);
    });

    it('should return an empty array if no movie contains the query in their title', async () => {
        const req = httpMocks.createRequest({
            body: {
                title: 'NotAMovie'
            }
        });
        const res = httpMocks.createResponse();

        await searchMovie(req, res);

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res._getJSONData().movies.length).toBe(0);
    });

    it('should return the specified number of movies per page', async () => {
        const req = httpMocks.createRequest({
            body: {
                title: 'The',
                limit: 10
            }
        });
        const res = httpMocks.createResponse();

        await searchMovie(req, res);

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res._getJSONData().movies.length).toBe(10);
        expect(res._getJSONData().page.totalPages).toBe(8);
        expect(res._getJSONData().page.size).toBe(10);
    });

    it('should return the specified page of movies', async () => {
        const req = httpMocks.createRequest({
            body: {
                title: 'The',
                limit: 10,
                page: 8
            }
        });
        const res = httpMocks.createResponse();

        await searchMovie(req, res);

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res._getJSONData().movies.length).toBe(4);
        expect(res._getJSONData().page.totalPages).toBe(8);
        expect(res._getJSONData().page.size).toBe(4);
        expect(res._getJSONData().page.currentPage).toBe(8);
    });

    it('should consider filters (such as genres, year and cast)', async () => {
        const req = httpMocks.createRequest({
            body: {
                title: 'The',
                genres: ['Horror', 'Thriller'],
                year: 2020,
                cast: ['Betty Gilpin']
            }
        });
        const res = httpMocks.createResponse();

        await searchMovie(req, res);

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res._getJSONData().movies.length).toBe(1);
        expect(res._getJSONData().movies[0].title).toBe('The Hunt');
    });
});
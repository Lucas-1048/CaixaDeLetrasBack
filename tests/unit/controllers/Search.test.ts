import { initializeDatabase } from '../../dbHandler';
import { Movie } from '../../../src/server/models/Movie';
import { User } from '../../../src/server/models/User';
import httpMocks from 'node-mocks-http';
import { StatusCodes } from "http-status-codes";
import { searchHandler } from '../../../src/server/controllers/Search';
import { movies, users } from '../../validDocuments';

let dbHandler : any;

beforeAll(async () => {
    dbHandler = await initializeDatabase();
    dbHandler.connect();

    await User.insertMany(users);
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

        await searchHandler.searchMovie(req, res);

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

        await searchHandler.searchMovie(req, res);

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

        await searchHandler.searchMovie(req, res);

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

        await searchHandler.searchMovie(req, res);

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

        await searchHandler.searchMovie(req, res);

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res._getJSONData().movies.length).toBe(1);
        expect(res._getJSONData().movies[0].title).toBe('The Hunt');
    });
});

describe('SearchUser Controller', () => {
    it('should return all users that contain the query in their username', async () => {
        const req = httpMocks.createRequest({
            body: {
                username: 'john',
                limit: 100
            }
        });
        const res = httpMocks.createResponse();

        await searchHandler.searchUser(req, res);

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res._getJSONData().users.length).toBe(5);
        expect(res._getJSONData().page.totalPages).toBe(1);
        expect(res._getJSONData().page.size).toBe(5);
    });

    it('should return an empty array if no user contains the query in their username', async () => {
        const req = httpMocks.createRequest({
            body: {
                username: 'NotAUser'
            }
        });
        const res = httpMocks.createResponse();

        await searchHandler.searchUser(req, res);

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res._getJSONData().users.length).toBe(0);
    });

    it('should return the specified number of users per page', async () => {
        const req = httpMocks.createRequest({
            body: {
                username: 'john',
                limit: 2
            }
        });
        const res = httpMocks.createResponse();

        await searchHandler.searchUser(req, res);

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res._getJSONData().users.length).toBe(2);
        expect(res._getJSONData().page.totalPages).toBe(3);
        expect(res._getJSONData().page.size).toBe(2);
    });

    it('should return the specified page of users', async () => {
        const req = httpMocks.createRequest({
            body: {
                username: 'john',
                limit: 2,
                page: 2
            }
        });
        const res = httpMocks.createResponse();

        await searchHandler.searchUser(req, res);

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res._getJSONData().users.length).toBe(2);
        expect(res._getJSONData().page.totalPages).toBe(3);
        expect(res._getJSONData().page.size).toBe(2);
        expect(res._getJSONData().page.currentPage).toBe(2);
    });
});
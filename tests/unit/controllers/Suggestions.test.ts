import { initializeDatabase } from '../../dbHandler';
import { User } from '../../../src/server/models/User';
import { Movie } from '../../../src/server/models/Movie';
import httpMocks from 'node-mocks-http';
import { StatusCodes } from "http-status-codes";
import { suggestions } from '../../../src/server/controllers/Suggestions';

let dbHandler : any;
let next : any;
let res : any;
let user : any;
let movies : any;

beforeAll(async () => {
    dbHandler = await initializeDatabase();
    dbHandler.connect();

    res = httpMocks.createResponse();
    next = jest.fn();

    user = new User(validUser);
    await user.save();
    res.locals.user = user;

    await Movie.insertMany(validMovies);
});

afterAll(async () => await dbHandler.closeDatabase());

const validUser = {
    username: 'johnDoe',
    email: 'doe@gmail.com',
    password: '12345678',
    birthDate: new Date("2004-03-31"),
    gender: 'Male',
    genres: ['Action', 'Drama'],
    favorites: [],
}

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
        genres: ['Drama'],
    },
    {
        title: 'Pulp Fiction',
        year: 1994,
        cast: ['John Travolta', 'Samuel L. Jackson'],
        genres: ['Drama'],
    },
    {
        title: 'Fight Club',
        year: 1999,
        cast: ['Brad Pitt', 'Edward Norton'],
        genres: ['Drama'],
    },
    {
        title: 'The Dark Knight',
        year: 2008,
        cast: ['Christian Bale', 'Heath Ledger'],
        genres: ['Drama'],
    },
    {
        title: 'Inception',
        year: 2010,
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
        genres: ['Drama'],
    },
    {
        title: 'The Matrix',
        year: 1999,
        cast: ['Keanu Reeves', 'Laurence Fishburne'],
        genres: ['Drama'],
    },
    {
        title: 'Gladiator',
        year: 2000,
        cast: ['Russell Crowe', 'Joaquin Phoenix'],
        genres: ['Drama'],
    },
    {
        title: 'The Departed',
        year: 2006,
        cast: ['Leonardo DiCaprio', 'Matt Damon'],
        genres: ['Drama'],
    },
    {
        title: 'The Silence of the Lambs',
        year: 1991,
        cast: ['Jodie Foster', 'Anthony Hopkins'],
        genres: ['Drama'],
    },
    {
        title: 'Die Hard',
        year: 1988,
        cast: ['Bruce Willis', 'Alan Rickman'],
        genres: ['Action'],
    },
    {
        title: 'The Terminator',
        year: 1984,
        cast: ['Arnold Schwarzenegger', 'Linda Hamilton'],
        genres: ['Action'],
    },
    {
        title: 'Mad Max: Fury Road',
        year: 2015,
        cast: ['Tom Hardy', 'Charlize Theron'],
        genres: ['Action'],
    },
    {
        title: 'John Wick',
        year: 2014,
        cast: ['Keanu Reeves', 'Michael Nyqvist'],
        genres: ['Action'],
    },
    {
        title: 'The Avengers',
        year: 2012,
        cast: ['Robert Downey Jr.', 'Chris Evans'],
        genres: ['Action'],
    },
    {
        title: 'Mission: Impossible - Fallout',
        year: 2018,
        cast: ['Tom Cruise', 'Henry Cavill'],
        genres: ['Action'],
    },
    {
        title: 'Jurassic Park',
        year: 1993,
        cast: ['Sam Neill', 'Laura Dern'],
        genres: ['Action'],
    },
    {
        title: 'The Fast and the Furious',
        year: 2001,
        cast: ['Vin Diesel', 'Paul Walker'],
        genres: ['Action'],
    },
    {
        title: 'The Dark Knight Rises',
        year: 2012,
        cast: ['Christian Bale', 'Tom Hardy'],
        genres: ['Action'],
    },
    {
        title: 'Raiders of the Lost Ark',
        year: 1981,
        cast: ['Harrison Ford', 'Karen Allen'],
        genres: ['Action'],
    },
];

describe('Suggestions for user', () => {
    it('should return a list of movies based on user genre preferences', async () => {
        const req = httpMocks.createRequest({
            params: {
                id:user._id
            }
        });

        await suggestions(req, res);

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res._getJSONData()).toHaveProperty('suggestions');
        expect(res._getJSONData().suggestions).toHaveLength(2);
        expect(res._getJSONData().suggestions[0]).toHaveProperty('genreName', 'Action');
        expect(res._getJSONData().suggestions[0].movies).toHaveLength(10);
        expect(res._getJSONData().suggestions[1]).toHaveProperty('genreName', 'Drama');
        expect(res._getJSONData().suggestions[1].movies).toHaveLength(10);
    });
});
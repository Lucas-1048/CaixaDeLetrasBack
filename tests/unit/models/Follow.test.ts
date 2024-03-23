import { initializeDatabase } from '../../dbHandler';
import { Follow } from '../../../src/server/models/Follow'
import mongoose from 'mongoose';

let dbHandler : any

beforeAll(async () => {
    dbHandler = await initializeDatabase();
    dbHandler.connect();
});

afterEach(async () => await dbHandler.clearDatabase());

afterAll(async () => await dbHandler.closeDatabase());

describe('Follow model', () => {
    test('Create a follow', async () => {
        const follow = new Follow({follower: new mongoose.Types.ObjectId(), following: new mongoose.Types.ObjectId()});
        await follow.save();

        const foundFollow = await Follow.findOne({follower: follow.follower, following: follow.following}).exec();
        expect(foundFollow).not.toBeNull();
    })

    test('Create a follow with invalid follower', async () => {
        const follow = new Follow({follower: '123', following: new mongoose.Types.ObjectId()});
        await follow.save().catch(err => {
            expect(err).not.toBeNull();
        });
    })

    test('Create a follow with invalid following', async () => {
        const follow = new Follow({follower: new mongoose.Types.ObjectId(), following: '123'});
        await follow.save().catch(err => {
            expect(err).not.toBeNull();
        });
    })

    test('Create a follow with invalid follower and following', async () => {
        const follow = new Follow({follower: '123', following: '123'});
        await follow.save().catch(err => {
            expect(err).not.toBeNull();
        });
    })

    test('Create a follow with duplicate follower and following', async () => {
        const follow = new Follow({follower: new mongoose.Types.ObjectId(), following: new mongoose.Types.ObjectId()});
        await follow.save();

        const follow2 = new Follow({follower: follow.follower, following: follow.following});
        await follow2.save().catch(err => {
            expect(err).not.toBeNull();
        });
    })
})
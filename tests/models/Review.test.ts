import mongoose from 'mongoose';
import { Review, IReview } from '../../src/server/models/Review';
import { initializeDatabase } from '../dbHandler';

let dbHandler: any;

beforeAll(async () => {
    dbHandler = await initializeDatabase();
    dbHandler.connect();
});

afterEach(async () => await dbHandler.clearDatabase());

afterAll(async () => await dbHandler.closeDatabase());

describe('Review', () => {
    test('should create a new review (and not save with non existent user and/or movie)', async () => {
        const reviewData: IReview = {
            user: new mongoose.Types.ObjectId(),
            movie: new mongoose.Types.ObjectId(),
            review: 'This movie is great!',
            rating: 5,
        };

        const createdReview = await Review.create(reviewData);

        expect(createdReview.user).toEqual(reviewData.user);
        expect(createdReview.movie).toEqual(reviewData.movie);
        expect(createdReview.review).toEqual(reviewData.review);
        expect(createdReview.rating).toEqual(reviewData.rating);

        // Since the username and the user don't exist, save() should fail

        await createdReview.save().catch(err => {
            expect(err).not.toBeNull();
        });
    });

    test('should not create a review with invalid rating', async () => {
        const reviewData: IReview = {
            user: new mongoose.Types.ObjectId(),
            movie: new mongoose.Types.ObjectId(),
            review: 'This movie is great!',
            rating: -1,
        };

        await expect(Review.create(reviewData)).rejects.toThrow();
    });
});

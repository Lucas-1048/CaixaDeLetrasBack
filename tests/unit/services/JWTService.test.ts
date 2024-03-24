import * as jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { JWTService } from '../../../src/server/services/JWTService';

describe('sign', () => {
    test('Signs a token correctly', () => {
        process.env.JWT_SECRET = 'test';

        const data = { uid: new Types.ObjectId() };

        const token = JWTService.sign(data);

        expect(token).toBeTruthy();

        const decodedData = jwt.decode(token) as { uid: string };
        expect(decodedData.uid).toEqual(data.uid.toString());
    });

    test('Try to sign before a secret is defined', () => {
        delete process.env.JWT_SECRET;

        const data = { uid: new Types.ObjectId() };

        const token = JWTService.sign(data);

        expect(token).toEqual('JWT_SECRET_NOT_FOUND');
    });
});

describe('verify', () => {
    test('Verifies a valid token correctly', () => {
        process.env.JWT_SECRET = 'test';

        const data = { uid: new Types.ObjectId() };

        const token = JWTService.sign(data);

        const decodedData = JWTService.verify(token);
        expect(typeof decodedData).not.toBe('string');
    });

    test('Try to verify without a jwt_secret', () => {
        delete process.env.JWT_SECRET;

        const token = JWTService.sign({ uid: new Types.ObjectId() });

        expect(JWTService.verify(token)).toEqual('JWT_SECRET_NOT_FOUND');
    });

    test('Try to verify an invalid token', () => {
        process.env.JWT_SECRET = 'test';

        const invalidToken = 'invalid_token';

        expect(JWTService.verify(invalidToken)).toEqual('INVALID_TOKEN');
    });
});


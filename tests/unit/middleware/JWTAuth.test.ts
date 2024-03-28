import { JWTService } from '../../../src/server/services/JWTService';
import { StatusCodes } from 'http-status-codes';
import { checkJwtToken } from '../../../src/server/middleware/JWTAuth';

jest.mock('./../../../src/server/services/JWTService', () => ({
    JWTService: {
        verify: jest.fn(),
    }
}));

describe('checkJwtToken middleware', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call next when req.params.id matches user ID', async () => {
        const req = { cookies: { access_token: 'validToken' }, params: { id: 'mockId' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        const mockJwtData = { uid: 'mockId' };

        (JWTService.verify as jest.Mock).mockReturnValue(mockJwtData);

        await checkJwtToken(req as any, res as any, next);

        expect(next).toHaveBeenCalled();
    });

    it('should return "Acess denied" message when token is missing', async () => {
        const req = { cookies: { access_token : undefined }, params: { id: 'mockId' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        const mockJwtData = { uid: 'mockId' };

        (JWTService.verify as jest.Mock).mockReturnValue(mockJwtData);

        await checkJwtToken(req as any, res as any, next);

        expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
    });

    it('should return "Acess denied" when user id does not match token uid', async () => {
        const req = { cookies: { access_token: 'validToken' }, params: { id: 'test' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        const mockJwtData = { uid: 'mockId' };

        (JWTService.verify as jest.Mock).mockReturnValue(mockJwtData);

        await checkJwtToken(req as any, res as any, next);

        expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
    });

    it('should call next when UID of token matches the admin ID', async () => {
        process.env.ADMIN = 'adminId';
        
        const req = { cookies: { access_token: 'validToken' }, params: { id: 'test' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        const mockJwtData = { uid: 'adminId' };

        (JWTService.verify as jest.Mock).mockReturnValue(mockJwtData);

        await checkJwtToken(req as any, res as any, next);

        expect(next).toHaveBeenCalled();
    });
});

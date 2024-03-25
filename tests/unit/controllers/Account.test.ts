import { StatusCodes } from "http-status-codes";
import { accountHandler } from "../../../src/server/controllers/Account";
import { User } from "../../../src/server/models/User";
import httpMocks from "node-mocks-http";

describe("Account Controller", () => {
    it("should return user information if user exists", async () => {
        User.findById = jest.fn().mockResolvedValueOnce({ name: "Test User" });

        const mockRequest = httpMocks.createRequest({
        method: "GET",
        params: { id: "123" },
        });

        const mockResponse = httpMocks.createResponse();

        await accountHandler.getAccountInfo(mockRequest, mockResponse);

        expect(mockResponse.statusCode).toBe(StatusCodes.OK);
        expect(mockResponse._getJSONData()).toEqual({ name: "Test User" });
    });

    it("should return 404 if user does not exist", async () => {
        User.findById = jest.fn().mockResolvedValueOnce(null);
        const mockRequest = httpMocks.createRequest({
            method: "GET",
            params: { id: "123" },
        });
    
        const mockResponse = httpMocks.createResponse();

        await accountHandler.getAccountInfo(mockRequest, mockResponse);

        expect(mockResponse.statusCode).toBe(StatusCodes.NOT_FOUND);
        expect(mockResponse._getJSONData()).toEqual({ "message": "User not found" });
    });
});

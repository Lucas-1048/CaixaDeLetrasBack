import express from 'express';
import { router } from './routes/Route';
import cookieParser from 'cookie-parser';

const server = express();

server.use(cookieParser());

server.use(express.json());

server.use(router);

export { server };
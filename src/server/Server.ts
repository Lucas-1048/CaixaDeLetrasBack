import express from 'express';
import { router } from './routes/Route';

const server = express();

server.use(express.json());

server.use(router);

export { server };
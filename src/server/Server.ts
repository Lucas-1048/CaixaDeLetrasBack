import express from 'express';
import { router } from './routes/Users';
import { fileErrorHandler } from './middleware/FileErrorHandler';
import cookieParser from 'cookie-parser';

const server = express();

server
  .use(cookieParser())
  .use(express.json())
  .use(router)
  .use(fileErrorHandler);

export { server };

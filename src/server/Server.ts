import express from 'express';
import { usersRouter } from './routes/Users';
import { moviesRouter } from './routes/Movies';
import { fileErrorHandler } from './middleware/FileErrorHandler';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from '../swagger.json';

const server = express();

server
  .use(cookieParser())
  .use(express.json())
  .use(usersRouter)
  .use(moviesRouter)
  .use(fileErrorHandler)
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export { server };

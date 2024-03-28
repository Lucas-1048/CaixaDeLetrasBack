import express from 'express';
import { router } from './routes/Users';
import { fileErrorHandler } from './middleware/FileErrorHandler';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from '../swagger.json';

const server = express();

server
  .use(cookieParser())
  .use(express.json())
  .use(router)
  .use(fileErrorHandler)
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export { server };

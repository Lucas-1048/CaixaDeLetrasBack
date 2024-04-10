import express from 'express';
import { userRouter } from './routes/Users';
import { reviewRouter } from './routes/Reviews';
import { fileErrorHandler } from './middleware/FileErrorHandler';
import { dataBaseErrorHandler } from './middleware/DatabaseErrorHandler';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from '../swagger.json';

const server = express();

server
  .use(cookieParser())
  .use(express.json())
  .use(userRouter)
  .use(reviewRouter)
  .use(dataBaseErrorHandler)
  .use(fileErrorHandler)
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export { server };

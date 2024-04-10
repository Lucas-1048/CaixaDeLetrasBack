import express from 'express';
import { usersRouter } from './routes/Users';
import { moviesRouter } from './routes/Movies';
import { reviewsRouter } from './routes/Reviews';
import { fileErrorHandler } from './middleware/FileErrorHandler';
import { dataBaseErrorHandler } from './middleware/DatabaseErrorHandler';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

const swaggerDocs = yaml.load('./src/swagger.yaml');
const server = express();

server
  .use(cookieParser())
  .use(express.json())
  .use(usersRouter)
  .use(moviesRouter)
  .use(reviewsRouter)
  .use(dataBaseErrorHandler)
  .use(fileErrorHandler)
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export { server };

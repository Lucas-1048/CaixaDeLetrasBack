import express from 'express';
import { usersRouter } from './routes/Users';
import { moviesRouter } from './routes/Movies';
import { reviewsRouter } from './routes/Reviews';
import { fileErrorHandler } from './middleware/FileErrorHandler';
import { dataBaseErrorHandler } from './middleware/DatabaseErrorHandler';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

const userDocs = yaml.load('./src/Users.yaml');
const movieDocs = yaml.load('./src/Movies.yaml');
const reviewDocs = yaml.load('./src/Reviews.yaml')
const server = express();

server
  .use(cookieParser())
  .use(express.json())
  .use(usersRouter)
  .use(moviesRouter)
  .use(reviewsRouter)
  .use(dataBaseErrorHandler)
  .use(fileErrorHandler)
  .use('/docs/user', swaggerUi.serveFiles(userDocs), swaggerUi.setup(userDocs))
  .use('/docs/movie', swaggerUi.serveFiles(movieDocs), swaggerUi.setup(movieDocs))
  .use('/docs/review', swaggerUi.serveFiles(reviewDocs), swaggerUi.setup(reviewDocs));

export { server };

import { type Express } from 'express';
import { MovieRouter } from './routes/movies.js';
import errorMiddleware from './middlewares/error.middleware.js';


export default (app: Express): void => {
  app.use('/api', new MovieRouter('/movie').router)

  app.use(errorMiddleware)
};

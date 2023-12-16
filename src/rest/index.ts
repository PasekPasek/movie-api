import { type Express } from 'express';
import { MovieRouter } from './routes/movies.js';


export default (app: Express): void => {
  app.use('/api', new MovieRouter('/movie').router)
};

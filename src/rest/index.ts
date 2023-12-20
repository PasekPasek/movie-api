import { type Express } from 'express';
import config from 'config';
import { MovieRouter } from './routes/movies.js';
import errorMiddleware from './middlewares/error.middleware.js';
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerJson from './apiDoc/swagger.js';


export default (app: Express): void => {
  app.use('/api', new MovieRouter('/movie').router)

  const deployEnv = config.get('service.deployEnv') as string;

  if ( deployEnv === 'development') {
    const options = {
      swaggerDefinition: swaggerJson,
      apis: [],
    };
    const swaggerDocs = swaggerJsdoc(options)
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  }

  app.use(errorMiddleware)
};

import { type NextFunction, type Request, type Response } from 'express';
import Joi from 'joi';
import { type BaseError } from '../../shared/errors/base.error.js';
import logger from '../../shared/utils/logger.utils.js';

type JoiErrorDetails = Joi.ValidationErrorItem[];
type HttpException = BaseError & {
  details?: JoiErrorDetails;
};
type JoiErrorMessage = {
  type: string;
  details: JoiErrorDetails;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware = (error: HttpException, request: Request, response: Response, next: NextFunction): void => {
  let status = error.status ?? 500;
  let message: string | JoiErrorMessage = error.message ?? 'Something went wrong';

  if (Joi.isError(error)) {
    status = 422;
    message = {
      type: 'Validation error',
      details: error.details,
    };
  }

  const errorContent = {
    status,
    message,
  };

  if (error.data !== undefined) {
    Object.assign(errorContent, { data: error.data });
  }

  if (error.name !== undefined) {
    Object.assign(errorContent, { name: error.name });
  }

  logger.error(error, `Error occured: %o`, errorContent);

  response.status(status).json(errorContent);
};

export default errorMiddleware;

import { BaseError, type ErrorArgs } from './base.error.js';

export class BadRequestError extends BaseError {
  constructor(errorArgs: ErrorArgs) {
    super({
      message: errorArgs.message ?? 'Bad request',
      name: 'BAD_REQUEST_ERROR',
      status: 400,
      data: errorArgs?.data,
    });
  }
}

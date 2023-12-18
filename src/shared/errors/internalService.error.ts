import { BaseError, type ErrorArgs } from './base.error.js';

export class InternalServiceError extends BaseError {
  constructor(errorArgs: ErrorArgs) {
    super({
      message: errorArgs.message ?? 'Internal service error',
      name: 'INTERNAL_SERVICE_ERROR',
      status: 500,
      data: errorArgs?.data,
    });
  }
}

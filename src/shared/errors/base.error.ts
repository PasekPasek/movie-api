export type ErrorArgs = {
  name?: string;
  message?: string;
  status?: number;
  data?: Record<string, unknown>;
};

export class BaseError extends Error {
  public readonly name: string;
  public readonly status: number;
  public readonly data: Record<string, unknown> | undefined;

  constructor(errorArgs: ErrorArgs) {
    super(errorArgs.message);

    this.name = errorArgs.name ?? 'SERVICE ERROR';
    this.status = errorArgs.status ?? 500;
    this.data = errorArgs.data;
  }
}

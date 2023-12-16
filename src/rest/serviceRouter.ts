import { Router } from 'express';

export abstract class ServiceRouter {
  router: Router;
  constructor(prefix: string) {
    this.router = Router();
    this.router.use(prefix, this.router);
  }
}

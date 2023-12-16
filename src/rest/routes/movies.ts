import { Container } from 'typedi';
import { type Request, type Response } from 'express';
import { type MovieDomainService } from '../../domain/movie/interfaces/movie.service.interface.js';
import { ServiceRouter } from '../serviceRouter.js';
import { MoviesService } from '../../domain/movie/services/movie.service.js';
import { asyncHandler } from '../../shared/utils/expressAsyncHandler.utils.js';

export class MovieRouter extends ServiceRouter {
  private readonly movieService: MovieDomainService;

  constructor(prefix: string) {
    super(prefix);
    this.movieService = Container.get(MoviesService);
    this.router.get('/', asyncHandler(this.getMovies.bind(this)));
  }

  async getMovies(req: Request, res: Response): Promise<Response> {
    const allMovies = await this.movieService.getMovies({ duration: 1, genres: [] });

    return res.send({ allMovies });
  }
}


import { Container } from 'typedi';
import { type Request, type Response } from 'express';
import { type MovieDomainService } from '../../domain/movie/interfaces/movie.service.interface.js';
import { ServiceRouter } from '../serviceRouter.js';
import { MoviesService } from '../../domain/movie/services/movie.service.js';
import { asyncHandler } from '../../shared/utils/expressAsyncHandler.utils.js';
import { type CreateMovieDTO } from '../../domain/movie/types/movie.types.js';

export class MovieRouter extends ServiceRouter {
  private readonly movieService: MovieDomainService;

  constructor(prefix: string) {
    super(prefix);
    this.movieService = Container.get(MoviesService);
    this.router.get('/', asyncHandler(this.getMovies.bind(this)));
    this.router.post('/', asyncHandler(this.addMovie.bind(this)));
  }

  async getMovies(req: Request, res: Response): Promise<Response> {
    const getMoviesParams = {
      genres: req.query.genres as string[] | undefined,
      ...(req.query.duration !== undefined && { duration: Number(req.query.duration as string) }),
    };

    const movies = await this.movieService.getMovies(getMoviesParams);

    return res.send({ allMovies: movies });
  }

  async addMovie(req: Request, res: Response): Promise<Response> {
    const moviePayload: CreateMovieDTO = req.body;

    await this.movieService.addMovie(moviePayload);

    return res.sendStatus(201);
  }
}

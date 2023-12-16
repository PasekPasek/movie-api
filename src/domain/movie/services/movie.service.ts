import { Inject, Service } from 'typedi';
import { type CreateMovieDTO, type GetMoviesParams, type MovieDocument } from '../types/movie.types.js';
import { type MovieDomainService } from '../interfaces/movie.service.interface.js';
import { MovieDomainRepository } from '../interfaces/movie.reposiory.interface.js';
import logger from '../../../shared/utils/logger.utils.js';
import { MOVIE_REPOSITORY } from '../../../di/serviceTokens.js';

@Service()
export class MoviesService implements MovieDomainService {
  constructor(@Inject(MOVIE_REPOSITORY) private readonly movieRepository: MovieDomainRepository) {}

  async getMovies(params: GetMoviesParams): Promise<MovieDocument[]> {
    return await this.movieRepository.getAllMovies();
  }

  async addMovie(moviePayload: CreateMovieDTO): Promise<void> {
    const allMovies = await this.movieRepository.getAllMovies();
    const lastMovieId = allMovies[allMovies.length - 1]?.id;

    const newMovie = {
      id: lastMovieId + 1,
      ...moviePayload,
    };

    await this.movieRepository.addMovie(newMovie);
    logger.info(`Movie ${newMovie.title} added`);
  }
}

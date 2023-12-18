import { Inject, Service } from 'typedi';
import { type CreateMovieDTO, type GetMoviesParams, type MovieDocument } from '../types/movie.types.js';
import { type MovieDomainService } from '../interfaces/movie.service.interface.js';
import { MovieDomainRepository } from '../interfaces/movie.reposiory.interface.js';
import logger from '../../../shared/utils/logger.utils.js';
import { MOVIE_REPOSITORY } from '../../../di/serviceTokens.js';
import { addMovieValidationSchema } from '../validators/addMovieValidationSchema.js';
import { getMoviesValidationSchema } from '../validators/getMoviesValidationSchema.js';
import { BadRequestError } from '../../../shared/errors/badRequest.error.js';
import { filterMoviesByDuration, filterMoviesByGenres, getRandomElement } from '../utils/movie.utils.js';
import { InternalServiceError } from '../../../shared/errors/internalService.error.js';

@Service()
export class MoviesService implements MovieDomainService {
  constructor(@Inject(MOVIE_REPOSITORY) private readonly movieRepository: MovieDomainRepository) {}

  async getMovies(params: GetMoviesParams): Promise<MovieDocument[]> {
    await getMoviesValidationSchema.validateAsync(params);
    let results = await this.movieRepository.getAllMovies();

    if (params.duration !== undefined) {
      results = filterMoviesByDuration(results, params.duration);
    }

    if (params.genres !== undefined) {
      results = filterMoviesByGenres(results, params.genres);
    } else {
      results = [getRandomElement(results)];
    }

    return results;
  }

  async addMovie(moviePayload: CreateMovieDTO): Promise<void> {
    await addMovieValidationSchema.validateAsync(moviePayload);

    const allowedGenres = (await this.movieRepository.getAllGenres()).map((genre) => genre.toLowerCase());

    if (!allowedGenres.length) {
      throw new InternalServiceError({ message: 'No allowed genres found' });
    }

    if (!moviePayload.genres.map((genre) => genre.toLowerCase()).every((genre) => allowedGenres.includes(genre))) {
      throw new BadRequestError({ message: 'Invalid genres', data: { allowedGenres } });
    }

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

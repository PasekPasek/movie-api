import { Inject, Service } from 'typedi';
import { type CreateMovieDTO, type GetMoviesParams, type MovieDocument } from '../types/movie.types.js';
import { type MovieDomainService } from '../interfaces/movie.service.interface.js';
import { MovieDomainRepository } from '../interfaces/movie.reposiory.interface.js';
import logger from '../../../shared/utils/logger.utils.js';
import { MOVIE_REPOSITORY } from '../../../di/serviceTokens.js';
import { addMovieValidationSchema } from '../validators/addMovieValidationSchema.js';
import { getMoviesValidationSchema } from '../validators/getMoviesValidationSchema.js';
import { BadRequestError } from '../../../shared/errors/badRequest.error.js';
import {
  filterMoviesByDuration,
  filterMoviesByGenres,
  getRandomElement,
  isMovieAlreadyInList,
} from '../utils/movie.utils.js';
import { InternalServiceError } from '../../../shared/errors/internalService.error.js';

@Service()
export class MoviesService implements MovieDomainService {
  constructor(@Inject(MOVIE_REPOSITORY) private readonly movieRepository: MovieDomainRepository) {}

  private async validateGenres(genres: string[]): Promise<void> {
    const allowedGenres = (await this.movieRepository.getAllGenres()).map((genre) => genre.toLowerCase());
    if (!allowedGenres.length) {
      logger.error('Could not validate movie genres');
      throw new InternalServiceError({ message: 'Could not validate movie genres' });
    }

    if (!genres.map((genre) => genre.toLowerCase()).every((genre) => allowedGenres.includes(genre))) {
      logger.error(`Invalid genres: ${genres}`);
      throw new BadRequestError({ message: `Invalid genres: ${genres}`, data: { allowedGenres } });
    }
  }

  private async validateIfMovieIsNotDuplicated(movie: CreateMovieDTO): Promise<void> {
    const allMovies = await this.movieRepository.getAllMovies();

    const isDuplicated = isMovieAlreadyInList(movie, allMovies);

    if (isDuplicated) {
      logger.error(`Movie already exists: ${movie.title} (${movie.year})})`);
      throw new BadRequestError({ message: `Movie already exists: ${movie.title} (${movie.year})` });
    }
  }

  async getMovies(params: GetMoviesParams): Promise<MovieDocument[]> {
    await getMoviesValidationSchema.validateAsync(params);
    if (params.genres?.length) await this.validateGenres(params.genres);
    let results = await this.movieRepository.getAllMovies();

    if (params.duration !== undefined) {
      results = filterMoviesByDuration(results, params.duration);
    }

    if (params.genres !== undefined) {
      results = filterMoviesByGenres(results, params.genres);
    } else {
      const randomElement = getRandomElement(results);
      results = randomElement ? [randomElement] : [];
    }

    return results;
  }

  async addMovie(moviePayload: CreateMovieDTO): Promise<void> {
    await addMovieValidationSchema.validateAsync(moviePayload);
    await this.validateIfMovieIsNotDuplicated(moviePayload)
    await this.validateGenres(moviePayload.genres);

    const allMovies = await this.movieRepository.getAllMovies();
    const lastMovieId = allMovies[allMovies.length - 1]?.id;

    const newMovie = {
      id: lastMovieId + 1,
      ...moviePayload,
    };

    await this.movieRepository.addMovie(newMovie);
  }
}

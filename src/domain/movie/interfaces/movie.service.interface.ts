import { type CreateMovieDTO, type GetMoviesParams, type MovieDocument } from '../types/movie.types.js';

export interface MovieDomainService {
  getMovies: (params: GetMoviesParams) => Promise<MovieDocument[]>;
  addMovie: (moviePayload: CreateMovieDTO) => Promise<void>;
};

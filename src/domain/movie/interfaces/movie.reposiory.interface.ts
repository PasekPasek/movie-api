import { type MovieDocument } from '../types/movie.types.js';

export interface MovieDomainRepository {
  getAllMovies: () => Promise<MovieDocument[]>;
  getAllGenres: () => Promise<string[]>;
  addMovie: (moviePayload: MovieDocument) => Promise<void>;
}

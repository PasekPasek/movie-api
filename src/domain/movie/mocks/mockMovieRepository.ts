import { MovieDomainRepository } from '../interfaces/movie.reposiory.interface.js';
import { mapMovieDocToMovieJsonFile, mapMovieJsonFileToMovieDoc } from '../mappers/movie.mapper.js';
import { JsonDbDocument, MovieDocument } from '../types/movie.types.js';

export class MockMovieRepository implements MovieDomainRepository {
  mockData: JsonDbDocument = {
    movies: [],
    genres: [],
  };

  setMockData(data: JsonDbDocument): void {
    this.mockData.genres = [...data.genres];
    this.mockData.movies = [...data.movies];

  }

  async addMovie(newMovieDoc: MovieDocument): Promise<void> {
    const newMovieJsonItem = mapMovieDocToMovieJsonFile(newMovieDoc);

    this.mockData.movies.push(newMovieJsonItem);
  }

  async getAllMovies(): Promise<MovieDocument[]> {
    return this.mockData.movies.map((movie) => mapMovieJsonFileToMovieDoc(movie));
  }

  async getAllGenres(): Promise<string[]> {
    return this.mockData.genres;
  }
}

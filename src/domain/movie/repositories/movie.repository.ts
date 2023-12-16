import { Service } from 'typedi';
import { type MovieDomainRepository } from '../interfaces/movie.reposiory.interface.js';
import { JsonFile } from '../../../infrastructure/json/jsonFile.client.js';
import { type MovieDocument } from '../types/movie.types.js';
import logger from '../../../shared/utils/logger.utils.js';

@Service()
export class MovieRepository implements MovieDomainRepository {
  constructor(private readonly jsonClient: JsonFile) {}

  async addMovie(newMovieDoc: MovieDocument): Promise<void> {
    const jsonFile = this.jsonClient.getFile();
    jsonFile.data.movies.push(newMovieDoc);

    await jsonFile.write();

    logger.info(`Movie ${newMovieDoc.title} added to the json file`);
  }

  async getAllMovies(): Promise<MovieDocument[]> {
    const jsonFile = this.jsonClient.getFile();
    return jsonFile.data.movies;
  }

  async getAllGenres(): Promise<string[]> {
    const jsonFile = this.jsonClient.getFile();
    return jsonFile.data.genres;
  }
}

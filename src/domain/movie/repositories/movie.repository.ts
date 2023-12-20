import { Service } from 'typedi';
import { type MovieDomainRepository } from '../interfaces/movie.reposiory.interface.js';
import { JsonFile } from '../../../infrastructure/json/jsonFile.client.js';
import { type MovieDocument } from '../types/movie.types.js';
import logger from '../../../shared/utils/logger.utils.js';
import { mapMovieDocToMovieJsonFile, mapMovieJsonFileToMovieDoc } from '../mappers/movie.mapper.js';
import { InternalServiceError } from '../../../shared/errors/internalService.error.js';

@Service()
export class MovieRepository implements MovieDomainRepository {
  constructor(private readonly jsonClient: JsonFile) {}

  async addMovie(newMovieDoc: MovieDocument): Promise<void> {
    const jsonFile = this.jsonClient.getFile();
    const newMovieJsonItem = mapMovieDocToMovieJsonFile(newMovieDoc);

    try{
      jsonFile.data.movies.push(newMovieJsonItem);
      await jsonFile.write();
    } catch(e) {
      logger.error(`Error adding movie ${newMovieDoc.title} to the json file`);
      throw new InternalServiceError({ message: 'Error adding movie to the json file' });
    }

    logger.info(`Movie ${newMovieDoc.title} with id ${newMovieDoc.id} added to the json file`);
  }

  async getAllMovies(): Promise<MovieDocument[]> {
    const jsonFile = this.jsonClient.getFile();
    return jsonFile.data.movies.map((movie) => mapMovieJsonFileToMovieDoc(movie));
  }

  async getAllGenres(): Promise<string[]> {
    const jsonFile = this.jsonClient.getFile();
    return jsonFile.data.genres;
  }
}

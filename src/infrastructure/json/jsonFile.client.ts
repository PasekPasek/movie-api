import { Service } from 'typedi';
import { JSONPreset } from 'lowdb/node';
import { type Low } from 'lowdb';
import config from 'config';
import logger from '../../shared/utils/logger.utils.js';
import path from 'path';
import { JsonDbDocument } from '../../domain/movie/types/movie.types.js';
import { InternalServiceError } from '../../shared/errors/internalService.error.js';

const defaultData: JsonDbDocument = {
  movies: [],
  genres: [],
};

@Service()
export class JsonFile {
  private jsonFile: Low<JsonDbDocument> | null = null;
  private readonly jsonFilePath: string = config.get('data.filePath');

  async connect(): Promise<Low<JsonDbDocument>> {
    if (this.jsonFile !== null) {
      return this.jsonFile;
    }

    const rootPath = process.cwd();

    const jsonFilePath = path.join(rootPath, this.jsonFilePath);
    this.jsonFile = await JSONPreset<JsonDbDocument>(jsonFilePath, defaultData);
    logger.info(`Connected to file ${jsonFilePath}`);

    return this.jsonFile;
  }

  getFile(): Low<JsonDbDocument> {
    if (this.jsonFile === null) {
      throw new InternalServiceError({message: 'JsonFile not connected'});
    }

    return this.jsonFile;
  }
}

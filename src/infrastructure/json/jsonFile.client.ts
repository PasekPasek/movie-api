import { Service } from 'typedi';
import { JSONPreset } from 'lowdb/node';
import { type Low } from 'lowdb';
import config from 'config';
import logger from '../../shared/utils/logger.utils.js';
import path from 'path';

export type MovieJsonDocument = {
  id: string;
  title: string;
  year: number;
  runtime: number;
  genres: string[];
  director: string;
  actors?: string;
  plot?: string;
  posterUrl?: string;
};

export type JsonDbDocument = {
  movies: MovieJsonDocument[];
  genres: string[];
};

const defaultData: JsonDbDocument = {
  movies: [],
  genres: [
    'Comedy',
    'Fantasy',
    'Crime',
    'Drama',
    'Music',
    'Adventure',
    'History',
    'Thriller',
    'Animation',
    'Family',
    'Mystery',
    'Biography',
    'Action',
    'Film-Noir',
    'Romance',
    'Sci-Fi',
    'War',
    'Western',
    'Horror',
    'Musical',
    'Sport',
  ],
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
      throw new Error('JsonFile not connected');
    }

    return this.jsonFile;
  }
}

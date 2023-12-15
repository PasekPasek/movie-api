import { Service } from 'typedi';
import { JSONPreset } from 'lowdb/node';
import { type Low } from 'lowdb';
import config from 'config';
import logger from '../../shared/utils/logger.utils.js';
import path from 'path';

export type Movie = {
  id: string;
  title: string;
  year: number;
  runtime: number;
  genres: string[];
  director: string;
  actors: string;
  plot: string;
  posterUrl: string;
};

export type JsonDb = {
  movies: Movie[];
  genres: string[];
};

const defaultData: JsonDb = {
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
  private jsonFile: Low<JsonDb> | null = null;
  private readonly jsonFilePath: string = config.get('data.filePath');

  async connect(): Promise<Low<JsonDb>> {
    if (this.jsonFile !== null) {
      return this.jsonFile;
    }

    // get root path of node
    const rootPath = process.cwd();

    const jsonFilePath = path.join(rootPath, this.jsonFilePath);
    this.jsonFile = await JSONPreset<JsonDb>(jsonFilePath, defaultData);
    logger.info(`Connected to file ${jsonFilePath}`);

    return this.jsonFile;
  }

  getFile(): Low<JsonDb> {
    if (this.jsonFile === null) {
      throw new Error('JsonFile not connected');
    }

    return this.jsonFile;
  }
}

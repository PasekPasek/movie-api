import { MovieDocument } from '../../domain/movie/types/movie.types.js';

export const isMovieArrayUnique = <T extends MovieDocument>(array: T[], key: keyof T = 'id'): boolean => {
  const unique = new Set();
  return array.every((item) => {
    const value = item[key];
    if (unique.has(value)) {
      return false;
    }
    unique.add(value);
    return true;
  });
}

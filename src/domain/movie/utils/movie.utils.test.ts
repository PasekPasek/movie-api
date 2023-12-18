import { MovieDocument } from '../types/movie.types';
import { filterMoviesByDuration, filterMoviesByGenres, getRandomElement } from './movie.utils';

describe('Movie Utils', () => {
  describe('getRandomElement', () => {
    afterEach(() => {
      jest.spyOn(global.Math, 'random').mockRestore();
    });

    it('should return undefined if no elements are passed', () => {
      // given
      const array: string[] = [];

      // when
      const result = getRandomElement(array);

      // then
      expect(result).toBeUndefined();
    });

    it('should be able to return first element', () => {
      // given
      const array: number[] = [1, 2, 3, 4, 5];

      // when
      jest.spyOn(global.Math, 'random').mockReturnValue(0);
      const result = getRandomElement(array);

      // then
      expect(result).toBe(1);
    });

    it('should be able to return last element', () => {
      // given
      const array: number[] = [1, 2, 3, 4, 5];

      // when
      jest.spyOn(global.Math, 'random').mockReturnValue(0.999999);
      const result = getRandomElement(array);

      // then
      expect(result).toBe(5);
    });
  });

  describe('filterMoviesByDuration', () => {
    it('should return all movies if no duration passed', () => {
      // given
      const moviesWithDuration: Pick<MovieDocument, 'runtime'>[] = [
        { runtime: 10 },
        { runtime: 15 },
        { runtime: 1 },
        { runtime: 1 },
      ];

      // when
      const result = filterMoviesByDuration(moviesWithDuration as MovieDocument[], undefined);

      // then
      expect(result).toMatchObject(moviesWithDuration);
    });

    it('should return only movies filtered by provided duration', () => {
      // given
      const moviesWithDuration: Pick<MovieDocument, 'runtime'>[] = [
        { runtime: 10 },
        { runtime: 15 },
        { runtime: 1 },
        { runtime: 100000 },
        { runtime: 12 },
        { runtime: 8 },
      ];

      // when
      const result = filterMoviesByDuration(moviesWithDuration as MovieDocument[], 10, 5);

      // then
      expect(result).toMatchObject([{ runtime: 10 }, { runtime: 12 }, { runtime: 8 }]);
    });
  });

  describe('filterMoviesByGenres', () => {
    it('should return only movies filtered by provided genres', () => {
      // given
      const moviesWithDuration: Pick<MovieDocument, 'id' | 'genres'>[] = [
        { id: 1, genres: ['genre8'] },
        { id: 2, genres: ['genre1', 'genre2', 'genre3'] },
        { id: 3, genres: ['genre1'] },
        { id: 4, genres: ['genre1', 'genre2', 'genre3', 'genre4', 'genre10'] },
      ];

      // when
      const result = filterMoviesByGenres(moviesWithDuration as MovieDocument[], ['genre1', 'genre3', 'genre4']);

      // then
      expect(result).toMatchObject([
        { id: 4, genres: ['genre1', 'genre2', 'genre3', 'genre4', 'genre10'] },
        { id: 2, genres: ['genre1', 'genre2', 'genre3'] },
        { id: 3, genres: ['genre1'] },
      ]);
    });

    it('should return all movies if no genres passed', () => {
      // given
      const moviesWithDuration: Pick<MovieDocument, 'id' | 'genres'>[] = [
        { id: 1, genres: ['genre8'] },
        { id: 2, genres: ['genre1', 'genre2', 'genre3'] },
        { id: 3, genres: ['genre1'] },
        { id: 4, genres: ['genre1', 'genre2', 'genre3', 'genre4', 'genre10'] },
      ];

      // when
      const result = filterMoviesByGenres(moviesWithDuration as MovieDocument[]);

      // then
      expect(result).toMatchObject(moviesWithDuration);
    });
  });
});

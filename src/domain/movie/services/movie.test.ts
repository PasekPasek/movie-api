import { MockMovieRepository } from '../mocks/mockMovieRepository';
import { MoviesService } from './movie.service';
import mockData from '../mocks/mockData';
import { GetMoviesParams, MovieDocument } from '../types/movie.types';
import { Container } from 'typedi';
import { MOVIE_REPOSITORY } from '../../../di/serviceTokens';
import { BadRequestError } from '../../../shared/errors/badRequest.error';
import { isMovieArrayUnique } from '../../../shared/utils/test.utils';

describe('movie service', () => {
  const mockMovieRepository = new MockMovieRepository();
  // inject mock repository to movie service
  Container.set(MOVIE_REPOSITORY, mockMovieRepository);
  const movieService = Container.get(MoviesService);

  beforeEach(() => {
    // set mock data
    mockMovieRepository.setMockData(mockData);
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('should return one random element if no params provided', async () => {
    // given
    const params: GetMoviesParams = {};

    // when
    const result = await movieService.getMovies(params);

    // then
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no movie is in duration range', async () => {
    // given
    const params: GetMoviesParams = { duration: 0 };

    // when
    const result = await movieService.getMovies(params);

    // then
    expect(result).toHaveLength(0);
  });

  it('should return movies with selected genres, sorted by hits', async () => {
    // given
    const params: GetMoviesParams = { genres: ['Drama', 'History', 'Thriller'] };

    // when
    const result = await movieService.getMovies(params);

    // then
    expect(result[0].genres).toContain('Drama');
    expect(result[0].genres).toContain('History');
    expect(result[0].genres).toContain('Thriller');
    expect(result.every((movie) => movie.genres.some((genre) => params.genres?.includes(genre)))).toBeTruthy();
    expect(isMovieArrayUnique(result)).toBeTruthy();
  });

  it('should return 1 random movie which is in duration range', async () => {
    // given
    const params: GetMoviesParams = { duration: 90 };

    // when
    const result = await movieService.getMovies(params);

    // then
    expect(result).toHaveLength(1);
    expect(result[0].runtime).toBeLessThanOrEqual(params.duration! + 10);
    expect(result[0].runtime).toBeGreaterThanOrEqual(params.duration! - 10);
  });

  it('should return movies with selected genres, sorted by hits, narrowed by duration', async () => {
    // given
    const params: GetMoviesParams = { genres: ['Drama', 'History', 'Thriller'], duration: 115 };

    // when
    const result = await movieService.getMovies(params);

    // then
    expect(result[0].genres).toContain('Drama');
    expect(result[0].genres).toContain('History');
    expect(result[0].genres).toContain('Thriller');
    expect(result.every((movie) => movie.genres.some((genre) => params.genres?.includes(genre)))).toBeTruthy();
    expect(result.every((movie) => movie.runtime <= params.duration! + 10)).toBeTruthy();
    expect(result.every((movie) => movie.runtime >= params.duration! - 10)).toBeTruthy();
    expect(isMovieArrayUnique(result)).toBeTruthy();
  });

  it('should store new movie, and return it for duration param', async () => {
    // given
    const newMovieDoc = { title: 'test', year: 2020, runtime: 20, genres: ['Drama'], director: 'test' };
    const preResult = await movieService.getMovies({ duration: 20 });
    expect(preResult).toHaveLength(0);

    // when
    await movieService.addMovie(newMovieDoc);

    // then
    const postResult = await movieService.getMovies({ duration: 20 });
    expect(postResult).toHaveLength(1);
    expect(postResult[0].title).toBe(newMovieDoc.title);
  });

  it('should store new movie, and return it as random value', async () => {
    // given
    // random would return last item
    jest.spyOn(global.Math, 'random').mockReturnValue(0.999999);
    const newMovieDoc = { title: 'test', year: 2020, runtime: 20, genres: ['Drama'], director: 'test' };
    const preResult = await movieService.getMovies({});
    expect(preResult[0].title).not.toBe(newMovieDoc.title);

    // when
    await movieService.addMovie(newMovieDoc);

    // then
    const postResult = await movieService.getMovies({});
    expect(postResult).toHaveLength(1);
    expect(postResult[0].title).toBe(newMovieDoc.title);
  });

  it('adding new record should throw error on invalid genres', async () => {
    // given
    const newMovieDoc = { title: 'test', year: 2020, runtime: 20, genres: ['Drama', 'Invalid'], director: 'test' };

    // when
    const t = movieService.addMovie(newMovieDoc);

    // then
    await expect(t).rejects.toThrow(BadRequestError);
  });

  it('adding dulicated record should throw error', async () => {
    // given
    const newMovieDoc = { title: 'test', year: 2020, runtime: 20, genres: ['Drama'], director: 'test' };

    // when
    await movieService.addMovie(newMovieDoc);
    const t = movieService.addMovie(newMovieDoc);

    // then
    await expect(t).rejects.toThrow(BadRequestError);
  });

  it('adding new record should throw error on invalid payload', async () => {
    // given
    const newMovieDoc = { title: 12345, year: 2020, runtime: 20, genres: ['Drama'], director: 'test' } as unknown;

    // when
    const t = movieService.addMovie(newMovieDoc as MovieDocument);

    // then
    await expect(t).rejects.toThrow('"title" must be a string');
  });

  it('adding new record should throw error on title too long', async () => {
    // given
    const newMovieDoc = {
      title: 'X'.repeat(256),
      year: 2020,
      runtime: 20,
      genres: ['Drama'],
      director: 'test',
    } as unknown;

    // when
    const t = movieService.addMovie(newMovieDoc as MovieDocument);

    // then
    await expect(t).rejects.toThrow('"title" length must be less than or equal to 255 characters long');
  });

  it('adding new record should throw error on record with duplicated genres', async () => {
    // given
    const newMovieDoc = {
      title: 'test',
      year: 2020,
      runtime: 20,
      genres: ['Drama', 'drama'],
      director: 'test',
    } as unknown;

    // when
    const t = movieService.addMovie(newMovieDoc as MovieDocument);

    // then
    await expect(t).rejects.toThrow('"genres[1]" contains a duplicate value');
  });

  it('getting movies should throw error on invalid genre', async () => {
    // given
    const params = { genres: ['Drama', 'Invalid'] };

    // when
    const t = movieService.getMovies(params);

    // then
    await expect(t).rejects.toThrow(BadRequestError);
  });

  it('getting movies should throw error on invalid genre type', async () => {
    // given
    const params = { genres: 'Drama' } as unknown;

    // when
    const t = movieService.getMovies(params as GetMoviesParams);

    // then
    await expect(t).rejects.toThrow('"genres" must be an array');
  });

  it('getting movies should throw error on invalid duration type', async () => {
    // given
    const params = { duration: 'invalid string' } as unknown;

    // when
    const t = movieService.getMovies(params as GetMoviesParams);

    // then
    await expect(t).rejects.toThrow('"duration" must be a number');
  });
});

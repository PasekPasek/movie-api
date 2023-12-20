import { Movie, MovieDocument } from '../types/movie.types.js';

export const getRandomElement = <T>(array: T[]): T | undefined => {
  if (array.length === 0) {
    return undefined;
  }

  if (array.length === 1) {
    return array[0];
  }

  return array[Math.floor(Math.random() * array.length)];
};

export const filterMoviesByDuration = <T extends MovieDocument>(
  movies: T[],
  duration: number | undefined,
  offSet: number = 10,
): T[] => {
  if (duration === undefined) {
    return movies;
  }

  const min = duration - offSet;
  const max = duration + offSet;
  return movies.filter((movie) => movie.runtime >= min && movie.runtime <= max);
};

export const filterMoviesByGenres = <T extends MovieDocument>(movies: T[], genres: string[] = []): T[] => {
  if (!genres?.length) {
    return movies;
  }

  const hitsFrequencyMap = new Map<number, number>();
  const moviesFilteredByGenres = movies.filter((movie) => {
    let hits = 0;
    genres.forEach((genreInQuery) => {
      if (movie.genres.find((movieGenre) => movieGenre.toLowerCase() === genreInQuery.toLowerCase())) {
        hits++;
      }
    });

    hitsFrequencyMap.set(movie.id, hits);
    return hits > 0;
  });

  moviesFilteredByGenres.sort((a, b) => {
    const hitsA = hitsFrequencyMap.get(a.id) || 0;
    const hitsB = hitsFrequencyMap.get(b.id) || 0;
    return hitsB - hitsA;
  });

  return moviesFilteredByGenres;
};

const compareMovies = <T extends Movie>(movieA: T, movieB: T): boolean => {
  return movieA.title === movieB.title && movieA.year === movieB.year;
};

export const isMovieAlreadyInList = <T extends Movie>(movie: T, movies: T[]): boolean => {
  return movies.some((movieB) => compareMovies(movie, movieB));
}

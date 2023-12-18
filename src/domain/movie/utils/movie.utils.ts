import { MovieDocument } from '../types/movie.types.js';

export const getRandomElement = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

export const filterMoviesByDuration = <T extends MovieDocument>(movies: T[], duration: number, offSet: number = 10): T[] => {
  const min = duration - offSet;
  const max = duration + offSet;
  return movies.filter((movie) => movie.runtime >= min && movie.runtime <= max);
}

export const filterMoviesByGenres = <T extends MovieDocument>(movies: T[], genres: string[]): T[] => {
  const hitsFrequencyMap = new Map<string, number>();
  const moviesFilteredByGenres = movies.filter((movie) => {
    let hits = 0;
    genres.forEach((genre) => {
      if (movie.genres.includes(genre)) {
        hits++
      }
    })

    hitsFrequencyMap.set(movie.id, hits)
    return hits > 0;
  });

  moviesFilteredByGenres.sort((a, b) => {
    const hitsA = hitsFrequencyMap.get(a.id) || 0;
    const hitsB = hitsFrequencyMap.get(b.id) || 0;
    return hitsB - hitsA;
  })

  return moviesFilteredByGenres;
}

import { MovieDocument, MovieJsonDocument } from '../types/movie.types.js';

export const mapMovieDocToMovieJsonFile = (movieDoc: MovieDocument): MovieJsonDocument => {
  return {
    id: movieDoc.id,
    title: movieDoc.title,
    year: `${movieDoc.year}`,
    runtime: `${movieDoc.runtime}`,
    director: movieDoc.director,
    genres: movieDoc.genres,
    actors: movieDoc.actors,
    plot: movieDoc.plot,
    posterUrl: movieDoc.posterUrl,
  };
}

export const mapMovieJsonFileToMovieDoc = (movieDoc: MovieJsonDocument): MovieDocument => {
  return {
    id: movieDoc.id,
    title: movieDoc.title,
    year: parseInt(movieDoc.year),
    runtime: parseInt(movieDoc.runtime),
    director: movieDoc.director,
    genres: movieDoc.genres,
    actors: movieDoc.actors,
    plot: movieDoc.plot,
    posterUrl: movieDoc.posterUrl,
  };
}

export type Movie = {
  title: string;
  year: number;
  runtime: number;
  genres: string[];
  director: string;
  actors?: string;
  plot?: string;
  posterUrl?: string;
}

export type CreateMovieDTO = Movie

export type MovieDocument = Movie & {
  id: number
}

export type GetMoviesParams = {
  duration?: number;
  genres?: string[];
}

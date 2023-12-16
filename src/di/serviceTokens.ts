import 'reflect-metadata';
import { Container, Token } from 'typedi';
import { type MovieDomainRepository } from '../domain/movie/interfaces/movie.reposiory.interface.js';
import { MovieRepository } from '../domain/movie/repositories/movie.repository.js';

export const MOVIE_REPOSITORY = new Token<MovieDomainRepository>('movieRepository');

Container.set(MOVIE_REPOSITORY, Container.get(MovieRepository));

import Joi from 'joi';

export const addMovieValidationSchema = Joi.object({
  title: Joi.string().required().max(255),
  year: Joi.number().required(),
  runtime: Joi.number().required(),
  genres: Joi.array().items(Joi.string()).unique().min(1).required(),
  director: Joi.string().required().max(255),
  actors: Joi.string().optional(),
  plot: Joi.string().optional(),
  posterUrl: Joi.string().optional(),
});


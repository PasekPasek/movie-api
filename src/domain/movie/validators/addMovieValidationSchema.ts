import Joi from 'joi';

export const addMovieValidationSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  runtime: Joi.number().required(),
  genres: Joi.array().items(Joi.string()).min(1).required(),
  director: Joi.string().required(),
  actors: Joi.string().optional(),
  plot: Joi.string().optional(),
  posterUrl: Joi.string().optional(),
});


import Joi from 'joi';

export const getMoviesValidationSchema = Joi.object({
  duration: Joi.number().optional(),
  genres: Joi.array().items(Joi.string()).optional(),
});

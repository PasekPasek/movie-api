export default {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Movie API',
  },
  host: 'localhost:8080',
  tags: [
    {
      name: 'api/movie',
      description: 'Getting or adding a movie',
    },
  ],
  paths: {
    '/api/movie': {
      get: {
        tags: ['api/movie'],
        summary: 'Search for a movie with duration and query parameters',
        description: `
        The endpoint should take 2 optional query parameters:

        - duration
        - an array of genres

        If we don't provide any parameter, then it should return a single random movie.

        If we provide only duration parameter, then it should return a single random movie that has a runtime between <duration - 10> and <duration + 10>.

        If we provide only genres parameter, then it should return all movies that contain at least one of the specified genres. Also movies should be orderd by a number of genres that match. For example if we send a request with genres [Comedy, Fantasy, Crime] then the top hits should be movies that have all three of them, then there should be movies that have one of [Comedy, Fantasy], [comedy, crime], [Fantasy, Crime] and then those with Comedy only, Fantasy only and Crime only.

        And the last one. If we provide both duration and genres parameter, then we should get the same result as for genres parameter only, but narrowed by a runtime. So we should return only those movies that contain at least one of the specified genres and have a runtime between <duration - 10> and <duration + 10>.

        In any of those cases we don't want to have duplicates.`,
        operationId: 'get-movie',
        produces: ['application/json'],
        parameters: [
          {
            name: 'duration',
            in: 'query',
            type: 'number',
            description: 'movie duration in minutes',
          },
          {
            name: 'genres[]',
            in: 'query',
            type: 'array',
            collectionFormat: 'multi',
            description: 'movie genres',
          },
        ],
        responses: {
          '200': {
            description: 'OK',
            schema: {
              $ref: '#/definitions/GetMovieResponse',
            },
          },
        },
      },
      post: {
        tags: ['api/movie'],
        summary: 'Add a new movie',
        description: `
        We need to be able to add a new movie. Each movie should contain information about:

        - a list of genres (only predefined ones from db file) (required, array of predefined strings)
        - title (required, string, max 255 characters)
        - year (required, number)
        - runtime (required, number)
        - director (required, string, max 255 characters)
        - actors (optional, string)
        - plot (optional, string)
        - posterUrl (optional, string)

        Each field should be properly validated and meaningful error message should be return in case of invalid value.`,
        operationId: 'create-movie',
        produces: [],
        parameters: [
          {
            in: 'body',
            name: 'body',
            required: true,
            type: 'object',
            description: 'Payload with movie data',
            schema: {
              $ref: '#/definitions/PostMoviePayload',
            },
          },
        ],
        responses: {
          '201': {
            description: 'OK',
          },
        },
      },
    },
  },
  definitions: {
    GetMovieResponse: {
      type: 'object',
      properties: {
        movies: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              title: { type: 'string', example: 'The Shawshank Redemption' },
              year: { type: 'integer', example: 1994 },
              runtime: { type: 'integer', example: 142 },
              genres: { type: 'array', items: { type: 'string', example: 'Drama' } },
              director: { type: 'string', example: 'Frank Darabont' },
              actors: { type: 'string', example: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler' },
              plot: { type: 'string', example: 'Plot description' },
              posterUrl: {
                type: 'string',
                example: 'https://m.media-amazon.com/images/M/MV5BMDFkYTdlYzAtZjEzZC00ZjQ0LWE5ZTUtMzYyZjI4ZmI',
              },
            },
          },
        },
      },
    },
    PostMoviePayload: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'The Shawshank Redemption' },
        year: { type: 'integer', example: 1994 },
        runtime: { type: 'integer', example: 142 },
        genres: { type: 'array', items: { type: 'string', example: 'Drama' } },
        director: { type: 'string', example: 'Frank Darabont' },
        actors: { type: 'string', example: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler' },
        plot: { type: 'string', example: 'Plot description' },
        posterUrl: {
          type: 'string',
          example: 'https://m.media-amazon.com/images/M/MV5BMDFkYTdlYzAtZjEzZC00ZjQ0LWE5ZTUtMzYyZjI4ZmI',
        },
      },
    },
  },
};

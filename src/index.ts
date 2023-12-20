import 'reflect-metadata';
import express from 'express';
import config from 'config';
import logger from './shared/utils/logger.utils.js';
import { JsonFile } from './infrastructure/json/jsonFile.client.js';
import { Container } from 'typedi';
import bodyParser from 'body-parser';
import rest from './rest/index.js';

const host: string = config.get('service.host');
const port: number = config.get('service.port');

const initalize = async (): Promise<void> => {
  try {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const jsonFileClient = Container.get(JsonFile);
    await jsonFileClient.connect();

    rest(app);

    app.listen(port, host, () => {
      logger.info(`Server started at ${host}:${port}`);
    });
  } catch (e) {
    logger.error('Taking down due unhandled exception.');
    logger.error(e);
    throw e;
  }
};

initalize().catch(() => process.exit(1));

import 'reflect-metadata';
import express from 'express';
import config from 'config';
import logger from './shared/utils/logger.utils.js';
import { JsonFile } from './infrastructure/json/jsonFile.client.js';
import { Container } from 'typedi';

const host: string = config.get('service.host');
const port: number = config.get('service.port');

const initalize = async (): Promise<void> => {
  try {
    const app = express();

    const jsonFileClient = Container.get(JsonFile);
    await jsonFileClient.connect();

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

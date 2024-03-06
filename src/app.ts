import { config } from '@user/config';
import { databaseConnection } from '@user/database';
import express ,{ Express } from 'express';
import { start } from '@user/server';


const initialize = async () => {
    config.cloudinaryConfig();
    databaseConnection();
    const app :Express = express();
    start(app);
};

initialize();
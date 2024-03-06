import { winstonLogger } from '@ashnewar/helper-library';
import { Logger } from 'winston';
import { config } from '@user/config';
import mongoose from 'mongoose';


const log:Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'userDatabase','debug');

export const databaseConnection =async (): Promise<void> =>{
    try {
        await mongoose.connect(`${config.DATABASE_URL}`);
        log.info('User Database Successfully Connected');
          
    } catch (error) {
        log.log('error','UserService databaseConnection error',error);
        log.error(`Error connecting to database: ${error}`);
    }
};
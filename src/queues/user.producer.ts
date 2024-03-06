import { winstonLogger } from '@ashnewar/helper-library';
import { config } from '@user/config';
import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@user/queues/connection';

const log:Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'UserMQConnectionProducer','debug');

export const userPublishDirectMessage=async(channel:Channel , exchangeName:string , routingKey:string , message:string , logMessage :string):Promise<void>=>{
    try {
        if(!channel){
            channel = await createConnection() as Channel;
        }
        await channel.assertExchange(exchangeName,'direct',{durable:true});
        channel.publish(exchangeName,routingKey,Buffer.from(message));
        log.info(logMessage);
    } catch (error) {
        log.log('error', 'UserService userPublishDirectMessage() Error', error);
        
    }
};


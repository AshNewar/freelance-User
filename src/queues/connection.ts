import { winstonLogger } from '@ashnewar/helper-library';
import { config } from '@user/config';
import client , {Channel , Connection} from 'amqplib';
import { Logger } from 'winston';

const log:Logger= winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'UserMQConnection','debug');

export async function createConnection(): Promise<Channel | undefined>{
    try {
        const connections:Connection = await client.connect(`${config.RABBITMQ_URL}`);
        const channel:Channel = await connections.createChannel();
        log.info('UserService RabbitMQ connection created');
        closeConnections(channel,connections);
        return channel;
        
    } catch (error) {
        log.log('error','UserService RabbitMQ connection error',error);
        return undefined;    
    }

}

export function closeConnections(channel:Channel , connection:Connection):void {
    process.once('SIGINT',async () => {
        await channel.close();
        await connection.close();
    });
}
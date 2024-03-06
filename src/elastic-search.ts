import { Client } from '@elastic/elasticsearch';
import { config } from '@user/config';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { winstonLogger } from '@ashnewar/helper-library';
import { Logger } from 'winston';

const log:Logger  = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'userServiceElasticSearchServer','debug'); 
export const elasticSearchClient =new Client({
    node: `${config.ELASTIC_SEARCH_URL}`
});

export const checkConnection =async () : Promise<void> =>{
    let isConnected =false ;
    while (!isConnected) {
        try {
            const health :ClusterHealthResponse =await elasticSearchClient.cluster.health({});
            log.info(`UserService Elasticsearch health status: ${health.status}`);
            isConnected = true;
            
        } catch (error) {
            log.error('Elasticsearch cluster is down!');
            log.log('error','UserService checkConnection() Error ',error);
            
        }
    }

};
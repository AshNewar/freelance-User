import { IBuyerDocument, ISellerDocument, winstonLogger } from '@ashnewar/helper-library';
import { config } from '@user/config';
import { Channel, ConsumeMessage, Replies } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@user/queues/connection';
import { createBuyer, updateBuyerPurchaseGigs } from '@user/services/buyer.service';
import { getRandomSellers, updateSellerCancelledJobs, updateSellerCompletedJobs, updateSellerGigsCount, updateSellerOngoingJobs, updateSellerReview } from '@user/services/seller.service';
import { userPublishDirectMessage } from '@user/queues/user.producer';


const log:Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'userServiceMQConsumer', 'debug');

export const consumerBuyerDirectMessage = async (channel: Channel) : Promise<void> =>{
    try {
        if(!channel){
            channel = await createConnection() as Channel;
        }
        const exchangeName = 'freelance-buyer-update'; 
        const routingKey= 'user-buyer';
        const queueName = 'buyer-update-queue';
        await channel.assertExchange(exchangeName,'direct',{durable:true});
        const freelanceQueue :Replies.AssertQueue =await channel.assertQueue(queueName,{durable:true ,autoDelete:false});
        await channel.bindQueue(freelanceQueue.queue,exchangeName,routingKey);
        await channel.consume(freelanceQueue.queue,async (msg)=>{
            const {type} = JSON.parse(msg!.content.toString());
            if(type==='auth'){
                const {username ,email ,profilePicture ,country ,createdAt} = JSON.parse(msg!.content.toString());
                const buyerData :IBuyerDocument ={
                    username,
                    email,
                    profilePicture,
                    country,
                    purchasedGigs:[],
                    createdAt
                };
                await createBuyer(buyerData);
            }
            else {
                const {buyerId , purchasedGigs } = JSON.parse(msg!.content.toString());
                await updateBuyerPurchaseGigs(buyerId,purchasedGigs,type);
            }
            channel.ack(msg!);
             
        });
    } catch (error) {
        log.log('error','UserService consumerBuyerDirectMessage() Error',error);
    }
};

export const consumeSellerDirectMessage = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await createConnection()) as Channel;
      }
      const exchangeName = 'freelance-seller-update';
      const routingKey = 'user-seller';
      const queueName = 'user-seller-queue';
      await channel.assertExchange(exchangeName, 'direct');
      const freelanceQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
      await channel.bindQueue(freelanceQueue.queue, exchangeName, routingKey);
      channel.consume(freelanceQueue.queue, async (msg: ConsumeMessage | null) => {
        const { type, sellerId, ongoingJobs, completedJobs, totalEarnings, recentDelivery, gigSellerId, count } = JSON.parse(
          msg!.content.toString()
        );
        if (type === 'create-order') {
          await updateSellerOngoingJobs(sellerId, ongoingJobs);
        } else if (type === 'approve-order') {
          await updateSellerCompletedJobs({
            sellerId,
            ongoingJobs,
            completedJobs,
            totalEarnings,
            recentDelivery
          });
        } else if (type === 'update-gig-count') {
          await updateSellerGigsCount(`${gigSellerId}`, count);
        } else if (type === 'cancel-order') {
          await updateSellerCancelledJobs(sellerId);
        }
        channel.ack(msg!);
      });
    } catch (error) {
      log.log('error', 'UsersService consumeSellerDirectMessage() method error:', error);
    }
  };
  
export const consumeReviewFanoutMessage = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await createConnection()) as Channel;
      }
      const exchangeName = 'freelance-review';
      const queueName = 'user-review-queue';
      await channel.assertExchange(exchangeName, 'fanout');
      const freelanceQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
      await channel.bindQueue(freelanceQueue.queue, exchangeName, '');
      channel.consume(freelanceQueue.queue, async (msg: ConsumeMessage | null) => {
        const {type } = JSON.parse(msg!.content.toString());
        if(type === 'buyer-review'){
          await updateSellerReview(JSON.parse(msg!.content.toString()));
          await userPublishDirectMessage(
            channel, 
            'freelance-update-gig', 
            'update-gig', 
            JSON.stringify({type : 'updateGig' , gigReview:msg!.content.toString()}), 
            'Message Sent to The Gig Service');
        }
        
        channel.ack(msg!);
      });
    } catch (error) {
      log.log('error', 'UsersService consumeReviewFanoutMessage() method error:', error);
    }
  };

export const consumeSeedGigDirectMessage = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await createConnection()) as Channel;
      }
      const exchangeName = 'freelance-gig';
      const routingKey = 'get-seller';
      const queueName = 'user-gig-queue';
      await channel.assertExchange(exchangeName, 'direct');
      const freelanceQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
      await channel.bindQueue(freelanceQueue.queue, exchangeName, routingKey);
      channel.consume(freelanceQueue.queue, async (msg: ConsumeMessage | null) => {
        const {type} = JSON.parse(msg!.content.toString());
        if(type === 'getSellers'){
          const {count } = JSON.parse(msg!.content.toString());
          const seller :ISellerDocument[] = await getRandomSellers(parseInt(count,10));
          await userPublishDirectMessage(
            channel, 
            'freelance-seed-gig', 
            'receive-seller', 
            JSON.stringify({type : 'receiveSellers' ,seller , count}), 
            'Message Sent to The Gig Service'); 
        }
        channel.ack(msg!);
      });
    } catch (error) {
      log.log('error', 'UsersService consumeSeedGigDirectMessage() method error:', error);
    }
  };
  
import { Application } from 'express';
import { buyerRoutes } from '@user/routes/buyer.route';
import { verifyGatewayRequest } from '@ashnewar/helper-library';
import { HealthRoute } from '@user/routes/health';
import { sellerRoutes } from '@user/routes/seller.route';

const BUYER_BASE_PATH = '/api/v1/buyer';
const SELLER_BASE_PATH = '/api/v1/seller';

export const appRoutes = (app: Application): void => {
    app.use('' , HealthRoute());
    app.use(BUYER_BASE_PATH,verifyGatewayRequest, buyerRoutes());
    app.use(SELLER_BASE_PATH,verifyGatewayRequest, sellerRoutes());
};
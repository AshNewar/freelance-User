
import { Request,Response } from 'express';
import { authUserPayloadMock, buyerMock, buyerMockRequest, buyerMockResponse } from '@user/controllers/buyer/test/mocks/buyer.mock.';
import * as buyer from '@user/services/buyer.service';
import { email, username } from '@user/controllers/buyer/get';

jest.mock('@user/services/buyer.service');
jest.mock('@user/services/seller.service');
jest.mock('@elastic/elasticsearch');

describe('Buyer Controller',()=>{
    beforeEach(()=>{
        jest.resetAllMocks();
    });
    afterEach(()=>{
        jest.clearAllMocks();
    });

    describe('Get Buyer',()=>{
        it('should return Buyer By email',async()=>{
            const req:Request = buyerMockRequest({},authUserPayloadMock) as unknown as Request;
            const res:Response = buyerMockResponse();
            jest.spyOn(buyer,'getBuyerByEmail').mockResolvedValue(buyerMock);
            await email(req,res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({message:'Buyer Profile',buyer:buyerMock});
        });
    });

    describe('Get Buyer',()=>{
        it('should return Buyer by Username',async()=>{
            const req:Request = buyerMockRequest({},authUserPayloadMock,{username :'test'}) as unknown as Request;
            const res:Response = buyerMockResponse();
            jest.spyOn(buyer,'getBuyerByUsername').mockResolvedValue(buyerMock);
            await username(req,res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({message:'Buyer Profile',buyer:buyerMock});
        });
    });
});
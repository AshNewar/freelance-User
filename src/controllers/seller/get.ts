import { ISellerDocument } from '@ashnewar/helper-library';
import { getRandomSellers, getSellerByEmail, getSellerById, getSellerByUsername } from '@user/services/seller.service';
import { Request, Response } from 'express';
import {StatusCodes} from 'http-status-codes';


export const id = async(req:Request,res:Response)  :Promise<void> => {
    const seller :ISellerDocument = await getSellerById (req.params.sellerId);
    res.status(StatusCodes.OK).json({message:'Seller fetched Successfully',seller});
};

export const username = async(req:Request,res:Response)  :Promise<void> => {
    const seller :ISellerDocument = await getSellerByUsername(req.params.username);
    res.status(StatusCodes.OK).json({message:'Seller fetched Successfully',seller});
};

export const email = async(req:Request,res:Response)  :Promise<void> => {
    const seller :ISellerDocument = await getSellerByEmail(req.params.email);
    res.status(StatusCodes.OK).json({message:'Seller fetched Successfully',seller});
};

export const random = async(req:Request,res:Response)  :Promise<void> => {
    const seller :ISellerDocument[]= await getRandomSellers(parseInt(req.params.size,10));
    res.status(StatusCodes.OK).json({message:'Seller fetched Successfully',seller});
};
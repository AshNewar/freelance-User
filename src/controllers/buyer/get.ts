import { IBuyerDocument } from '@ashnewar/helper-library';
import { getBuyerByEmail, getBuyerByUsername } from '@user/services/buyer.service';
import { Request, Response } from 'express';
import {StatusCodes} from 'http-status-codes';


export const email = async (req:Request , res:Response): Promise<void>  =>{
    const buyer :IBuyerDocument | null = await getBuyerByEmail(`${req.currentUser!.email}`);
    res.status(StatusCodes.OK).json({message:'Buyer Profile',buyer});

};

export const currentUsername = async (req:Request , res:Response): Promise<void>  =>{
    const buyer :IBuyerDocument | null = await getBuyerByUsername(`${req.currentUser!.username}`);
    res.status(StatusCodes.OK).json({message:'Buyer Profile',buyer});

};

export const username = async (req:Request , res:Response): Promise<void>  =>{
    const buyer :IBuyerDocument | null = await getBuyerByUsername(`${req.params.username}`);
    res.status(StatusCodes.OK).json({message:'Buyer Profile',buyer});
};
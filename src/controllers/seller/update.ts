import { BadRequestError, ISellerDocument } from '@ashnewar/helper-library';
import { sellerSchema } from '@user/schemes/seller';
import { updateSeller } from '@user/services/seller.service';
import { Request, Response } from 'express';
import {StatusCodes} from 'http-status-codes';


export const update= async(req:Request ,res:Response)  :Promise<void> => {
    const {error} = await Promise.resolve(sellerSchema.validate(req.body));
    if(error) {
        throw new BadRequestError(error.details[0].message, 'Seller update() error');
    }
    const sellerData:ISellerDocument = {
        profilePublicId: req.body.profilePublicId,
        fullName: req.body.fullName,
        username: req.currentUser!.username,
        email: req.body.email,
        profilePicture: req.body.profilePicture,
        description: req.body.description,
        oneliner: req.body.oneliner,
        country: req.body.country,
        skills: req.body.skills,
        languages: req.body.languages,
        responseTime: req.body.responseTime,
        experience: req.body.experience,
        education: req.body.education,
        socialLinks: req.body.socialLinks,
        certificates: req.body.certificates

    };
    const updatedSeller : ISellerDocument = await updateSeller(req.params.sellerId , sellerData);

    res.status(StatusCodes.OK).json({
        message:'Seller created Successfully',
        seller:updatedSeller
    });

};
import { BadRequestError, IOrderMessage, IRatingTypes, IReviewMessageDetails, ISellerDocument } from '@ashnewar/helper-library';
import { SellerModel } from '@user/models/seller.schema';
import mongoose from 'mongoose';
import { updateBuyerToSeller } from '@user/services/buyer.service';


export const getSellerById = async (id :string) :Promise<ISellerDocument> => {
    const seller :ISellerDocument | null = await SellerModel.findById(new mongoose.Types.ObjectId(id)).exec() as ISellerDocument;
    return seller;
};

export const getSellerByEmail = async (email :string) :Promise<ISellerDocument> => {
    const seller :ISellerDocument | null = await SellerModel.findOne({email}).exec() as ISellerDocument;
    return seller;
};

export const getSellerByUsername = async (username :string) :Promise<ISellerDocument> => {
    const seller :ISellerDocument | null = await SellerModel.findOne({username}).exec() as ISellerDocument;
    return seller;
};

export const getRandomSellers = async (count :number) :Promise<ISellerDocument[]> => {
    const sellers :ISellerDocument[] | null = await SellerModel.aggregate([{ $sample: { size: count } }]).exec() as ISellerDocument[];
    return sellers;
};

export const createSeller = async (sellerData: ISellerDocument) :Promise<ISellerDocument> => {
    const existSeller = await getSellerByEmail(`${sellerData.email}`);
    if(existSeller){
        throw new BadRequestError('Seller Already Exist' , 'Seller createSeller() error');
    }
    const seller :ISellerDocument = await SellerModel.create(sellerData) as ISellerDocument;
    await updateBuyerToSeller(`${seller.email}`);
    return seller;
};

//Update Functions

export const updateSeller = async (sellerId :string , sellerData :ISellerDocument ) : Promise<ISellerDocument> => {
    const seller :ISellerDocument | null = await SellerModel.findByIdAndUpdate(new mongoose.Types.ObjectId(sellerId),sellerData,{new:true}).exec() as ISellerDocument;
    return seller;

};

export const updateSellerGigsCount = async (sellerId :string , count :number) : Promise<void> => {
    await SellerModel.updateOne(
        { _id : sellerId },
        {
            $inc:{
                totalGigs:count
            }
        }
    ).exec();
};

export const updateSellerOngoingJobs = async (sellerId :string , count :number) : Promise<void> => {
    await SellerModel.updateOne(
        { _id : sellerId },
        {
            $inc:{
                ongoingJobs:count
            }
        }
    ).exec();
};

export const updateSellerCancelledJobs = async (sellerId :string) : Promise<void> => {
    await SellerModel.updateOne(
        { _id : sellerId },
        {
            $inc:{
                ongoingJobs:-1,
                cancelledJobs:1
            }
        }
    ).exec();
};

export const updateSellerCompletedJobs = async (data : IOrderMessage) : Promise<void> => {
    const {sellerId , ongoingJobs , completedJobs , totalEarnings , recentDelivery} = data ;
    await SellerModel.updateOne(
        { _id : sellerId },
        {
            $inc:{
                ongoingJobs,
                completedJobs,
                totalEarnings
            },
            $set:{
                recentDelivery : new Date(recentDelivery!)
            }
        }
    ).exec();

};

export const updateSellerReview = async (data : IReviewMessageDetails) : Promise<void> => {
    const ratingTypes: IRatingTypes = {
        '5': 'five',
        '4': 'four',
        '3': 'three',
        '2': 'two',
        '1': 'one'
    };
    const ratingKey :string = ratingTypes[`${data.rating}`];
    await SellerModel.updateOne(
        { _id : data.sellerId },
        {
            $inc:{
                ratingsCount:1,
                ratingSum:data.rating,
                [`ratingCategories.${ratingKey}.value`]:data.rating,
                [`ratingCategories.${ratingKey}.count`]:1
            }
        }
    ).exec();

};

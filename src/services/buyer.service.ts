import { BadRequestError, IBuyerDocument } from '@ashnewar/helper-library';
import { BuyerModel } from '@user/models/buyer.schema';

export const getBuyerByEmail = async (email:string): Promise< IBuyerDocument | null>  =>{
    const buyer:IBuyerDocument | null  = await BuyerModel.findOne({email}).exec() as IBuyerDocument;
    return buyer;
};

export const getBuyerByUsername = async (username:string): Promise< IBuyerDocument | null>  =>{
    const buyer:IBuyerDocument | null  = await BuyerModel.findOne({username}).exec() as IBuyerDocument; 
    return buyer;
};

export const getRandomBuyers = async (count :number): Promise< IBuyerDocument[]>  =>{
    const buyers:IBuyerDocument[] = await BuyerModel.aggregate([{ $sample: { size: count } }]).exec() as IBuyerDocument[];
    return buyers;

};

export const createBuyer =async (buyerData: IBuyerDocument) : Promise<void> => {
    const existUser : IBuyerDocument | null = await getBuyerByEmail(`${buyerData.email}`); 
    if(existUser){
        throw new BadRequestError('User Already Exist' , 'Buyer createBuyer() error');
    }
    await BuyerModel.create(buyerData);
};

export const updateBuyerToSeller =async (email:string) : Promise<void> => {
    await BuyerModel.updateOne(
        { email },
        {
            $set:{
                isSeller:true
            }
        }
    ).exec();
    
};

export const updateBuyerPurchaseGigs =async (buyerId:string, purchasedGigId : string , type :string ) : Promise<void> => {
    await BuyerModel.updateOne(
        { _id : buyerId },
        type === 'purchased-gigs' ? 
        { $push: { purshasedGigs: purchasedGigId } } 
        : 
        { $pull: { purshasedGigs: purchasedGigId } }
    ).exec();  
};

 
import { IBuyerDocument } from '@ashnewar/helper-library';
import mongoose, { Model, Schema, model } from 'mongoose';


const buyerSchema =new Schema({
    username: {
        type: String,
        required: true,
        index :true
    },
    email:{
        type:String,
        required:true,
        index:true
    },
    profilePicture:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    }, 
    isSeller:{
        type :Boolean,
        default:false
    },
    purshasedGigs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Gig'
    }],
    createdAt:{
        type:Date,
        default:Date.now
    },
},{
    timestamps:true,
    versionKey:false
});

const BuyerModel:Model<IBuyerDocument> = model<IBuyerDocument>('Buyer',buyerSchema,'Buyer');
export { BuyerModel };
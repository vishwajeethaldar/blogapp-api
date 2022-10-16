import { blacklistedInterface } from '../interface';
import mongoose from 'mongoose';

const blacklistedSchema = new mongoose.Schema({
    kind:{type:String},
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"user"},
    token:{type:String},
    active:{type:Boolean},
})

const blacklisted = mongoose.model<blacklistedInterface.blacklisted & mongoose.Document>("blacklisted", blacklistedSchema)
export default blacklisted
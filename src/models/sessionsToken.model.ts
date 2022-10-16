import {sessionInterface} from '../interface/index';
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    kind:{type:String, enum:["access", "refresh"]},
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"user"},
    token:{type:String},
    active:{type:Boolean},
})

const Session = mongoose.model<sessionInterface.session & mongoose.Document>("session", sessionSchema)

export default Session
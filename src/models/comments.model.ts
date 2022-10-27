import mongoose, { Schema, Types } from "mongoose";
import {bloginterface} from '../interface/'

const comentSchema = new mongoose.Schema<bloginterface.comment>({
    userId:{type:Schema.Types.ObjectId, ref:"user"},
    blogId:{type:Schema.Types.ObjectId, ref:"blog"},
    commentText:{type:String, required:true},
    parentId:{type:mongoose.Schema.Types.ObjectId, ref:"comment"}
})

const commentModel = mongoose.model("comment", comentSchema)
export default commentModel;

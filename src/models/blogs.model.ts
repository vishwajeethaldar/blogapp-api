
import mongoose, { Schema } from "mongoose";
import {bloginterface} from '../interface/'

const blogSchema = new mongoose.Schema<bloginterface.blog>({
    categoryId:{type:Schema.Types.ObjectId, ref:"Category", required:true},
    title:{type:String, required:true, unique:true},
    userId:{type:Schema.Types.ObjectId, ref:"User",required:true},
    content:{type:String, required:true},
    approved:{type:Boolean, default:false}
})

const Blog = mongoose.model("Blog", blogSchema)
export default Blog;

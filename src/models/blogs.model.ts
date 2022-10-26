import mongoose from "mongoose";
import {bloginterface} from '../interface/'

const blogSchema = new mongoose.Schema<bloginterface.blog>({
    category:{type:String, require:true},
    title:{type:String, require:true},
    userId:{type:String, required:true},
    blogId:{type:String, required:true},
    content:{type:String, required:true}
})

const blogModel = mongoose.model("blog", blogSchema)


import mongoose, { Schema } from "mongoose";
import {bloginterface} from '../interface/'

const categorySchema = new mongoose.Schema<bloginterface.category>({
    name:{type:String, require:true},
    userId:{type:Schema.Types.ObjectId, required:true},
})

const categoryModel = mongoose.model("category", categorySchema)
export default categoryModel;

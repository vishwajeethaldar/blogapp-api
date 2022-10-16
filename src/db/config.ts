import mongoose from "mongoose";
import { config } from "../providers";
const dbConnect = async ()=>{
    return await mongoose.connect(config().mongoosedb)
}
export default dbConnect;
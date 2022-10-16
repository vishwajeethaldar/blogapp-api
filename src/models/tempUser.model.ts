import {userInterface} from '../interface/index'
import mongoose, { Schema } from 'mongoose'

const userSchema = new  mongoose.Schema<userInterface.Iuser>({
    name:String,
    email:{type:String, unique:true},
    password:String,
    otp:String,
    role:{type:String, default:"user"}
})

const tempUser = mongoose.model('tempuser', userSchema)
export default tempUser
import {userInterface} from '../interface/index'
import mongoose, { Schema } from 'mongoose'

const userSchema = new  mongoose.Schema<userInterface.Iuser>({
    name:String,
    email:{type:String, unique:true},
    password:String,
    otp:String,
    role:{type:String, default:"user"}
})

const User = mongoose.model('user', userSchema)
export default User
import { Request, Response } from "express";
import { User } from "../models";
import { config } from "../providers";
import { ZohoMail } from "../utils";
import { hashPassword, verifyHashedPassword } from "../utils/argon2Utils";

export const sendOtp = async(req:Request, res:Response)=>{
        const {email, subject} = req.body
        let otp = Math.floor(Math.random()*(999999-111111)+111111);

        try{
            const user = await User.findOne({email:email})
            if(user){
                
                let zmailRes =  await ZohoMail.Z_Mail_Transport.sendMail({
                    to:email,
                    from:config().Z_Mail,
                    subject:subject,
                    text:`OTP to Verify Your accoutn is ${otp}`
                })
                await User.findOneAndUpdate({email:email}, {$set:{otp:otp.toString()}})
                return res.send({status:"success", responce:"email send successfully"})
            }
            
        }catch(e:any){
           return res.send(e.message)
        }
}

export const  invalidateOtp = async(req:Request,res:Response)=>{
    const {email} = req.body
    try{
        await User.findOneAndUpdate({email:email}, {$set:{otp:""}})
        res.send("OTP Expired")
    }catch(e:any){
        res.send(e.message)
    }
} 



export const resetPassword = async(req:Request, res:Response)=>{

        const {email, otp, newPassword}:{email:string,otp:string,newPassword:string } =  req.body

        let hashedpassword = await hashPassword(newPassword)
        try{
            let userforPReset = await User.findOne({email:email})
            if(userforPReset)
            
            {   
               if(userforPReset.otp!==otp){
                    res.send("Incorrect OTP")
               }

              await User.findOneAndUpdate({email:email}, {$set:{otp:"", password:hashedpassword}})
              res.send("Password Changes Sucessfully")
            }else{
                return res.send("Incorect email")
            }
        }catch(e:any){
            return  res.send(e.message)
        }
}


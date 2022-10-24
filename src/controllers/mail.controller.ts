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
               let updatedOtp = await User.updateOne({email:email}, {$set:{otp:otp.toString()}})
               console.log(updatedOtp);
               
                return res.send({status:"success", responce:"email send successfully"})
            }else{
                res.status(401).send("Email Not Exists")
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
      
        try{
            let hashedpassword = await hashPassword(newPassword)
            let userforPReset = await User.findOne({email:email})
            if(userforPReset)
            {   
                console.log(userforPReset, "otp"+otp);
                console.log(req.body);
                
               if(userforPReset.otp!==otp){
                    return res.send("Incorrect OTP")
               }
              else{
                await User.findOneAndUpdate({email:email}, {$set:{otp:"", password:hashedpassword}})
                return res.send({status:"success", msg:"Password Changes Sucessfully"})
              }
            }else{
                return res.send("Incorect email")
            }
        }catch(e:any){
                   
            return  res.send(e.message)
        }
}


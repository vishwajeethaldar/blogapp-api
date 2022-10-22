import { Request, Response } from "express";
import { User } from "../models";
import {TempUser} from "../models";
import { config } from "../providers";
import { jwtutils, ZohoMail } from "../utils";
import { hashPassword } from "../utils/argon2Utils";
/*
const userRegister = async(req:Request, res:Response)=>{
        const {name, email, password} = req.body
        const hashedPwd = await hashPassword(password)
        try{
            let user = await User.findOne({email:email})
            if(user){
                res.send("User Already Exists Please Login")
            }else{
                const newUser = await User.create({name:name, email:email, password:hashedPwd})
                res.send(newUser)
            }
            
        }
        catch(e:any){
            res.status(401).send(e.message)
        }
        

}

*/

export const welcome = async(req:Request, res:Response)=>{
    res.send("Hellow")
}
const userRegister = async(req:Request, res:Response)=>{
    const {name, email, password} = req.body
    const hashedPwd = await hashPassword(password)
    try{
        let user = await User.findOne({email:email})
        if(user){
            res.send("User Already Exists Please Login")
        }else{
           
            let payloadData = {name:name, email:email, secret:hashedPwd}
            let token = jwtutils.singJwt(payloadData,"2h","access")
            await ZohoMail.Z_Mail_Transport.sendMail({
                to:email,
                from:config().Z_Mail,
                subject:"Verify your Account",
                text:`Hellow \n Welcome to blog.hintuts.in, click here to verify your email`,
                html:`<div>
                <h3>Hellow <br/> Welcome to blog.hinditutts.in <br/> Please Click here to verify your email</h3>
                <a href=${config().DEFAULTURL}/api/user/confirm?verify=${token}>Verify Email</a>
                </div>`
            })
            res.send("Verification Link Send Successfully")
        }
        
    }
    catch(e:any){
        res.status(401).send(e.message)
    }
}


 const verifyUserRegistration = async(req:Request, res:Response)=>{
             interface tokenData {
                name:string,
                email:string,
                secret:string
            }

            let token = req.query.verify?.toString()||"";
           
            let {name, email, secret}  = jwtutils.verifyJwt(token, "access")?.decoded as tokenData
            console.log(name, email, secret)

            if(!email){
               return res.send("Link Expired please register again")
            }

            let exist = await User.findOne({email:email})
            if(exist){
               return  res.send("User Already Registered")
            }

            await User.create({name:name, email:email, password:secret})
            return res.send("User Registered Successfully")
}

export {userRegister, verifyUserRegistration}
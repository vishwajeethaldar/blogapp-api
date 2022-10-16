import { Request, Response } from "express";
import { User } from "../models";
import { jwtutils } from "../utils";
import { hashPassword } from "../utils/argon2Utils";

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


export {userRegister}
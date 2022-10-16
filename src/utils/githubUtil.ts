import {Request, Response} from "express";
import { config } from "../providers";
import axios from "axios";
import { User } from "../models";
import {sessionconfig} from '../utils'
import { hashPassword } from "./argon2Utils";
import { sessionInterface } from "../interface";
import { sessiontype } from "../types/types";

export const githubCallBack = async(req:Request, res:Response)=>{
    let token = req.query.code   
    try{
    let data= await axios.post(`https://github.com/login/oauth/access_token`, {
        client_id:config().GITCLIEND_ID,
        client_secret:config().GIT_CLIENT_SECRET,
        code:token,
        header:{
            Accept: 'application/json'
        }
    })
    

    let accessKey = data.data?.split("&")[0].split("=")[1]

    let user = await axios.get("https://api.github.com/user", {
        headers:{
            Authorization: `Bearer ${accessKey}` 
        }
    })
    
        let existUser = await User.findOne({email:user.data?.email})
       
        let tokens={
            AT:{},
            RT:{}
        }

        if(!existUser){
            let hashedPwd = await hashPassword(config().DEFAULTPASSCODE)
            let newUser =  await User.create({name:user.data.name, email:user.data.email, passowrd:hashedPwd})
            tokens= await sessionconfig.createSession(newUser._id) 
        }else{
           tokens= await sessionconfig.createSession(existUser._id)
        }

        res.cookie("accessToken", tokens.AT, {
            maxAge:5000,
            httpOnly:true
        });  
        
        res.cookie("refreshToken", tokens.RT, {
            maxAge:3.154e+10,
            httpOnly:true   
        });  
    
        // res.redirect(`${config().DEFAULTURL}/api/session?email=${newUser.email}`)
        res.send(tokens.AT)

    }catch(e:any){
        res.send(e.message)
    }
}



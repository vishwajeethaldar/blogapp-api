import {Request, Response} from "express";
import { config } from "../providers";
import axios from "axios";
import { User } from "../models";
import {jwtutils, sessionconfig} from '../utils'
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
            accessToken:"",
            refreshToken:""
        }

        if(!existUser){
            let hashedPwd = await hashPassword(config().DEFAULTPASSCODE)
            let newUser =  await User.create({name:user.data.name, email:user.data.email, passowrd:hashedPwd})
            tokens.accessToken = jwtutils.singJwt({userId:newUser._id}, '2m', "access")
            tokens.refreshToken = jwtutils.singJwt({userId:newUser._id,xyz:"xyz"}, '30d',"refresh")
              
        }else{
            tokens.accessToken = jwtutils.singJwt({userId:existUser._id, role:existUser.role}, '2m', "access")
            tokens.refreshToken = jwtutils.singJwt({userId:existUser._id,role:existUser.role}, '30d',"refresh")
           
        }

        res.cookie("accessToken", tokens.accessToken, {
            maxAge:120000,
            httpOnly:true
        });  
        console.log(tokens.refreshToken);
        
        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge:3.154e+10,
            httpOnly:true   
        });  
    
        res.redirect(`http://localhost:5173/login/git/callback`)
        // res.send(tokens.AT)

    }catch(e:any){
        res.send(e.message)
    }
}



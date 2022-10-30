import { Request, Response } from "express";
import { User } from "../models";
import { jwtutils } from "../utils";
import {Session} from "../models"
import { verifyHashedPassword } from "../utils/argon2Utils";
import { sessiontype } from "../types/types";
import jwt from "jsonwebtoken"
interface tokenData {
    userId:string,
    role:string,
    iat:number,
    exp:number
    }

interface accessTokenInterface {
    userId:string,
    iat:number,
    role:string,
    exp:number
}
// login handler
async function createSessionhandler(req:Request, res:Response){
        const {email, password} = req.body      
        try{
            const user = await User.findOne({email:email})
            if(user){

              if(!(await verifyHashedPassword(user.password, password)) ){
                  return res.send("incorrect password")
              }
                const accessToken = jwtutils.singJwt({userId:user._id, role:user.role}, '2m', "access")
                const refreshToken = jwtutils.singJwt({userId:user._id,role:user.role}, '30d',"refresh")
             
                res.cookie("accessToken", accessToken, {
                 maxAge:120000,
                 httpOnly:true
                });  
                
                res.cookie("refreshToken", refreshToken, {
                 maxAge:2.628e+9,
                 httpOnly:true   
                });  
                let decodedToken = jwtutils.verifyJwt(accessToken, "access")?.decoded
                return res.send({...decodedToken})
            }else{
                return res.status(401).send("User does not exists")  
            }

        }catch(e:any){
              return res.status(401).send(e.message)  
        }
}


// Delete Session Logout
async function deleteSesson(req:Request, res:Response){
        
        const {refreshToken, accessToken} = req.cookies
        if(refreshToken===undefined){
            return res.send("No session found")
        }
        try{
            await Session.deleteOne({_id:refreshToken._id})        
            res.cookie("refreshToken", "", {
                maxAge:0,
                httpOnly:true   
               }); 
               res.cookie("accessToken", "", {
                maxAge:0,
                httpOnly:true
            }); 
            return res.send({status:"success"}) 
        }catch(e:any){
            return res.status(401).send(e.message)
        }   
}
   

// New Refresh Token
async function newRefreshToken(req:Request, res:Response){
    const {refreshToken, accessToken} = req.cookies

   try{
    if(accessToken!==undefined){      
        const validSession = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData

        return res.send({...validSession})      
    }
    if(!refreshToken){
        return res.status(400).send("Invalid Session Login Again")
    }
   
    const  decodedSession = jwtutils.verifyJwt(refreshToken, "refresh")?.decoded as tokenData
   
   
    if(!decodedSession){
        return res.status(401).send("Invalid Session Login Again")
    }
     
        
    const Token = jwtutils.singJwt({userId:decodedSession.userId, role:decodedSession.role}, '2m', "access");

    res.cookie("accessToken", Token, {
        maxAge:120000,
        httpOnly:true
    }); 
    const decoded =  jwtutils.verifyJwt(Token, "access")?.decoded  as  accessTokenInterface ;
    console.log(decodedSession, decoded, "refrfesh");
    return res.send({...decoded})
         
   }catch(e:any){
    return res.status(401).send("Invalid Session Login Again")
   }
}

export {createSessionhandler,deleteSesson,newRefreshToken}

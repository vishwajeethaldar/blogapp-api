import { Request, Response } from "express";
import { User } from "../models";
import { jwtutils } from "../utils";
import {Session} from "../models"
import { verifyHashedPassword } from "../utils/argon2Utils";
import { sessiontype } from "../types/types";


// login handler
async function createSessionhandler(req:Request, res:Response){
        
        const {email, password} = req.body      
       
        try{
            const user = await User.findOne({email:email})
            if(user){
              if(!(await verifyHashedPassword(user.password, password)) ){
                  return res.send("incorrect password")
              }
                const accessToken = jwtutils.singJwt({userId:user._id}, '2m', "access")
                const refreshToken = jwtutils.singJwt({userId:user._id,xyz:"xyz"}, '30d',"refresh")
                // const AT = await Session.create({userId:user._id, token:accessToken, kind:"access", active:true})             
                const RT = await Session.create({userId:user._id, token:refreshToken, kind:"refresh", active:true})
               
                res.cookie("accessToken", accessToken, {
                 maxAge:120000,
                 httpOnly:true
                });  
                
                res.cookie("refreshToken", RT, {
                 maxAge:2.628e+9,
                 httpOnly:true   
                });  
 
                let decodedToken = jwtutils.verifyJwt(accessToken, "access")
                res.status(200).send(decodedToken)
          
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
        const validSession = jwtutils.verifyJwt(accessToken, "access")
        return res.status(200).send(validSession)
    }

    if(!refreshToken){
        return res.status(401).send("Invalid Session Login Again")
    }

    if(!jwtutils.verifyJwt(refreshToken.token, "refresh")){
        return res.status(401).send("Invalid Session Login Again")
    }

    let sessionExist = await Session.findOne({_id:refreshToken?._id})
    if(!sessionExist){
        return res.status(401).send("Invalid Session Login Again")
    }
    const Token = jwtutils.singJwt({userId:refreshToken.userId}, '30s', "access");
    // await Session.updateOne({userId:refreshToken.userId,kind:"access", active:true}, {$set:{token:Token}}); 
    res.cookie("accessToken", Token, {
        maxAge:120000,
        httpOnly:true
    }); 

    const decoded = jwtutils.verifyJwt(Token, "access")
    console.log(decoded);
    
    return res.send(decoded)       
   }catch(e:any){
    return res.status(401).send("Invalid Session Login Again")
   }
}

export {createSessionhandler,deleteSesson,newRefreshToken}

// get the session

// log out
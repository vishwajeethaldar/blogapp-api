import { Request, Response } from "express";
import { User } from "../models";
import { jwtutils } from "../utils";
import {Session} from "../models"
import { verifyHashedPassword } from "../utils/argon2Utils";


// login handler
async function createSessionhandler(req:Request, res:Response){
        
        const {email, password} = req.body      
       
        try{
            const user = await User.findOne({email:email})

            if(user){
              
              console.log(user)
              if(!(await verifyHashedPassword(user.password, password)) ){
                  res.send("incorrect password")
              }
                const accessToken = jwtutils.singJwt({userId:user._id}, '1h')
                const refreshToken = jwtutils.singJwt({userId:user._id,xyz:"xyz"}, '1y')
                const AT = await Session.create({userId:user._id, token:accessToken, kind:"access", active:true})             
                const RT = await Session.create({userId:user._id, token:refreshToken, kind:"refresh", active:true})
               
                res.cookie("accessToken", AT, {
                 maxAge:3600000,
                 httpOnly:true
                });  
                
                res.cookie("refreshToken", RT, {
                 maxAge:3.154e+10,
                 httpOnly:true   
                });  
 
                let decodedToken = jwtutils.verifyJwt(AT.token, "access")
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
        
        const {refreshToken} = req.cookies
  
        await Session.updateMany({userId:refreshToken.userId, active:true}, {$set:{active:false}}) 
        
        res.cookie("refreshToken", "", {
            maxAge:0,
            httpOnly:true   
           }); 
           res.cookie("accessToken", "", {
            maxAge:0,
            httpOnly:true
           }); 

        return res.send({sucess:true})    
}
   

// New Refresh Token
async function newRefreshToken(req:Request, res:Response){
     
    const {refreshToken} = req.cookies

    if(refreshToken){
        const Token = jwtutils.singJwt({userId:refreshToken._userId}, '5s');
        await Session.updateOne({userId:refreshToken.userId,kind:"access", active:true}, {$set:{token:Token}});
        let newaccessToken = await Session.findOne({userId:refreshToken.userId,kind:"access", active:true});
       
    res.cookie("accessToken", newaccessToken, {
        maxAge:5000,
        httpOnly:true
        }); 

    return res.send(newaccessToken)
    }
}

export {createSessionhandler,deleteSesson,newRefreshToken}

// get the session

// log out
import { Request, Response, NextFunction } from "express";
import { jwtutils } from "../utils";

export const AuthenticateUser = async(req:Request, res:Response, next:NextFunction)=>{
    const {accessToken} = req.cookies
    
    let decode =  jwtutils.verifyJwt(accessToken.token, "access")
    
    if(decode){
       return next()
    }

    return res.status(401).send("Session Expired")
}   
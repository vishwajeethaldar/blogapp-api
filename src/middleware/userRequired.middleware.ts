import { Request, Response, NextFunction } from "express";
import { jwtutils } from "../utils";

export const AuthenticateUser = async(req:Request, res:Response, next:NextFunction)=>{
    const {accessToken} = req.cookies
    console.log(accessToken);
    if(accessToken){
       return next()
    }

    return res.status(401).send("Session Expired")
}   
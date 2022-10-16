import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { sessionInterface } from "../interface";
import { blacklisted,Session, User } from "../models";
import { jwtutils } from ".";
import { Response } from "express";

export const getSession = async(sessionId:string)=>{

   try{
    let session = await Session.findById(sessionId)
    
    if(session){
        return session.active?session.token:null
    }
   }catch(e:any){
        return e.message
   }

}

export const invalidateSession = async(sessionId:string)=>{

    try{
     let session = await Session.findById(sessionId)
     
     if(session){
          await Session.findOneAndUpdate({_id:sessionId}, {$set:{active:false}})
          let invalidSession = await Session.findById(sessionId)
          return invalidSession
     }
    }catch(e:any){
         return e.message
    }
 
 }

 export const createSession = async(userId:any)=>{
               try{
               const accessToken = jwtutils.singJwt({userId:userId}, '1',"access")
               const refreshToken = jwtutils.singJwt({userId:userId}, '1y',"refresh")
               const AT = await Session.create({userId:userId, token:accessToken, kind:"access", active:true})             
               const RT = await Session.create({userId:userId, token:accessToken, kind:"refresh", active:true})
               return {AT:AT, RT:RT}

    }catch(e:any){
         return e.message
    }
 
 }


import { Request, Response } from "express";
import { Comment, User } from "../models";
import { jwtutils } from "../utils";


interface tokenData {
    userId:string,
    iat:string,
    exp:string
}

export const addComment =  async(req:Request, res:Response)=>{
    const {accessToken} = req.cookies
    const decoded = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData
  
    try{
        if(!decoded){
            return res.status(401).send("Session expired ")
        }
        const user = await User.findOne({_id:decoded?.userId})     
        if(user){
            const newComment = await Comment.create({...req.body}) 
            return res.send(newComment)
        }else{
            return res.status(401).send("Sign in to Comment")
        }
    }catch(e:any){
        return res.status(401).send(e.message)
    }
}


export const deleteComment =  async(req:Request, res:Response)=>{
    const {accessToken} = req.cookies
    const id = req.params.id
    const decoded = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData
    
    try{
        if(!decoded){
            return res.status(401).send("Session expired ")
        }
        const user = await User.findOne({_id:decoded?.userId})
            
        if(user?.role==="admin"){
            const comRes = await Comment.deleteOne({_id:id}) 
            return res.send("Comment Deleted Successfully")
        }else{
            return res.status(401).send("Sign in to Comment")
        }
     
    }catch(e:any){
        return res.status(401).send(e.message)
    }
}



export const getCommentInfo =  async(req:Request, res:Response)=>{
    const {accessToken} = req.cookies
    const id = req.params.id
    const decoded = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData
    try{
        if(!decoded){
            return res.status(401).send("Session expired ")
        }
        const user = await User.findOne({_id:decoded?.userId})
            
        if(user?.role==="admin"){
            const existComment = await Comment.findOne({_id:id}) 
            return res.send(existComment)
        }else{
            return res.status(401).send("As you admin for privillege")
        }
     
    }catch(e:any){
        return res.status(401).send(e.message)
    }
}

export const getAllComment =  async(req:Request, res:Response)=>{
    try{
        const allComment = await Comment.findOne({}) 
        return res.send(allComment)  
    }catch(e:any){
        return res.status(401).send(e.message)
    }
}



export const updateComment =  async(req:Request, res:Response)=>{
    const {accessToken} = req.cookies
    const id = req.params.id
    const decoded = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData
    try{
        if(!decoded){
            return res.status(401).send("Session expired ")
        }
        const user = await User.findOne({_id:decoded?.userId})
            
        if(user){
            const existBlog = await Comment.updateOne({_id:id}, {$set:{...req.body}})
            const updatedBlog = await Comment.findOne({_id:id})
            return res.send(updatedBlog)
        }else{
            return res.status(401).send("As you admin for privillege")
        }
     
    }catch(e:any){
        return res.status(401).send(e.message)
    }
}



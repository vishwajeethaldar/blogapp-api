import { Request, Response } from "express";
import { userInterface } from "../interface";
import { Blog, User } from "../models";
import { jwtutils } from "../utils";


interface tokenData {
    userId:string,
    iat:string,
    exp:string
}

export const addBlog =  async(req:Request, res:Response)=>{
    const {accessToken} = req.cookies
    const decoded = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData
  
    try{
        if(!decoded){
            return res.status(401).send("Session expired ")
        }
        const user = await User.findOne({_id:decoded?.userId})       
        if(user?.role==="admin"){
            const nBlog = await Blog.create({...req.body}) 
            const newBlog = await Blog.findOne({_id:nBlog._id}).populate("userId","name email role").populate("categoryId")
            return res.send(newBlog)
        }else{
            return res.status(401).send("As you admin for privillege")
        }
     
    }catch(e:any){
        return res.status(401).send(e.message)
    }
}


export const deleteBlog =  async(req:Request, res:Response)=>{
    const {accessToken} = req.cookies
    const id = req.params.id
    const decoded = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData
  
    try{
        
        if(!decoded){
            return res.status(401).send("Session expired ")
        }
        const user = await User.findOne({_id:decoded?.userId})
            
        if(user?.role==="admin"){
            const newBlog = await Blog.deleteOne({_id:id}) 
            return res.send("Blog Deleted Successfully")
        }else{
            return res.status(401).send("As you admin for privillege")
        }
     
    }catch(e:any){
        return res.status(401).send(e.message)
    }
}



export const getBlogInfo =  async(req:Request, res:Response)=>{
    const {accessToken} = req.cookies
    const id = req.params.id
   
    try{
        const decoded = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData
        if(!decoded){
            return res.status(401).send("Session expired ")
        }
        const user = await User.findOne({_id:decoded?.userId})
            
        if(user?.role==="admin"){
            const existBlog = await Blog.findOne({_id:id}) 
            return res.send(existBlog)
        }else{
            return res.status(401).send("As you admin for privillege")
        }
     
    }catch(e:any){
        return res.status(401).send(e.message)
    }
}


export const updateBlog =  async(req:Request, res:Response)=>{
    console.log(req.body)
    const {accessToken} = req.cookies
    const id = req.params.id

    try{
        const decoded = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData
        if(!decoded){
            return res.status(401).send("Session expired ")
        }
        const user = await User.findOne({_id:decoded?.userId})
            
        if(user?.role==="admin"){
            await Blog.updateOne({_id:id}, {$set:{...req.body}})
            const updatedBlog = await Blog.findOne({_id:id})
            return res.send(updatedBlog)
        }else{
            return res.status(401).send("As you admin for privillege")
        }
    }catch(e:any){
        return res.status(401).send(e.message)
    }
}


export const getAllBlog = async(req:Request, res:Response)=>{
    const {accessToken} = req.cookies

    try{
        const decoded = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData
        if(!decoded){
            const bogsList = await Blog.find({approved:true}).populate("userId","name email role").populate("categoryId")
            return res.send(bogsList)
        }
       const user = await User.findOne({_id:decoded.userId})
       if(user?.role==="admin"){
            const bogsList = await Blog.find().populate("userId","name email role").populate("categoryId")
            return res.send(bogsList)
       }else{
        const bogsList = await Blog.find({approved:true}).populate("userId","name email role").populate("categoryId")
        return res.send(bogsList)
       }
    }catch(e:any){
        return res.status(401).send(e.message)
    }
}
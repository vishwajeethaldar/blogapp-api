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
            const newBlog = await Blog.create({...req.body}) 
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
    const decoded = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData
    try{
        
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
    const {accessToken} = req.cookies
    const id = req.params.id
    const decoded = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData
    try{
        
        if(!decoded){
            return res.status(401).send("Session expired ")
        }
        const user = await User.findOne({_id:decoded?.userId})
            
        if(user?.role==="admin"){
            const existBlog = await Blog.updateOne({_id:id}, {$set:{...req.body}})
            return res.send(existBlog)
        }else{
            return res.status(401).send("As you admin for privillege")
        }
    }catch(e:any){
        return res.status(401).send(e.message)
    }
}


export const getAllBlog = async(req:Request, res:Response)=>{
    try{
        const bogsList = await Blog.find({})
        return res.send(bogsList)
    }catch(e:any){
        return res.status(401).send(e.message)
    }
}
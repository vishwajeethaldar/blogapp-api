import { Request, Response } from "express";
import { Category, User } from "../models";
import { jwtutils } from "../utils";


interface tokenData {
    userId:string,
    iat:string,
    exp:string
}

export const addCategory =  async(req:Request, res:Response)=>{
    const {accessToken} = req.cookies
    const decoded = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData
  
    try{
        if(!decoded){
            return res.status(401).send("Session expired ")
        }
        const user = await User.findOne({_id:decoded?.userId})       
        if(user?.role==="admin"){
            const newCategory = await Category.create({...req.body}) 
            return res.send(newCategory)
        }else{
            return res.status(401).send("As you admin for privillege")
        }
     
    }catch(e:any){
        return res.status(401).send(e.message)
    }
}


export const deleteCategory =  async(req:Request, res:Response)=>{
    const {accessToken} = req.cookies
    const id = req.params.id
    const decoded = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData
  
    try{
        
        if(!decoded){
            return res.status(401).send("Session expired ")
        }
        const user = await User.findOne({_id:decoded?.userId})
            
        if(user?.role==="admin"){
            const deletedCategory = await Category.deleteOne({_id:id}) 
            return res.send("Category Deleted Successfully")
        }else{
            return res.status(401).send("As you admin for privillege")
        }
     
    }catch(e:any){
        return res.status(401).send(e.message)
    }
}



export const getCategoryInfo =  async(req:Request, res:Response)=>{
    const {accessToken} = req.cookies
    const id = req.params.id
    const decoded = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData
    try{
        if(!decoded){
            return res.status(401).send("Session expired ")
        }
        const user = await User.findOne({_id:decoded?.userId})
            
        if(user?.role==="admin"){
            const existCategory = await Category.findOne({_id:id}) 
            return res.send(existCategory)
        }else{
            return res.status(401).send("As you admin for privillege")
        }
     
    }catch(e:any){
        return res.status(401).send(e.message)
    }
}


export const getAllCategory =  async(req:Request, res:Response)=>{
    const {accessToken} = req.cookies
    const decoded = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData
    try{
        if(!decoded){
            return res.status(401).send("Session expired ")
        }
        const user = await User.findOne({_id:decoded?.userId})
            
        if(user?.role==="admin"){
            const categories = await Category.find({}) 
            return res.send(categories)
        }else{
            return res.status(401).send("As you admin for privillege")
        }
    }catch(e:any){
        return res.status(401).send(e.message)
    }
}


export const updateCategory =  async(req:Request, res:Response)=>{
    const {accessToken} = req.cookies
    const id = req.params.id
    const decoded = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData
    try{
        
        if(!decoded){
            return res.status(401).send("Session expired ")
        }
        const cat_name = await Category.findOne({name:req.body.name})
        if(cat_name){
            return res.status(500).send("Alredy Exists")
        }
        const user = await User.findOne({_id:decoded?.userId})
            
        if(user?.role==="admin"){
            const existBlog = await Category.updateOne({_id:id}, {$set:{...req.body}})
            const updateBlog = await Category.findOne({_id:id})
            return res.send(updateBlog)
        }else{
            return res.status(401).send("As you admin for privillege")
        }
     
    }catch(e:any){
        return res.status(401).send(e.message)
    }
}

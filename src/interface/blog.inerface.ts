import { Types } from "mongoose";

export interface blog {
    categoryId:Types.ObjectId;
    title:string;
    content:string;
    userId:Types.ObjectId;
    approved:boolean;
}


export interface comment {
    userId:Types.ObjectId;
    blogId:Types.ObjectId;
    commentText:string;
    parentId?:Types.ObjectId;
}


export interface category {
    name:string;
    userId: Types.ObjectId;
}
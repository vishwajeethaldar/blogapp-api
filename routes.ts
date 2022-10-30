import { Express } from "express";
import { invalidateOtp, resetPassword, sendOtp } from "./src/controllers/mail.controller";
import {createSessionhandler, deleteSesson, newRefreshToken} from './src/controllers/session.controller'
import { userRegister, verifyUserRegistration, getUserInfo } from "./src/controllers/users.controller";
import { gitCallBack } from "./src/utils";
import ServerlessHttp from "serverless-http"
import { AuthenticateUser } from "./src/middleware/userRequired.middleware";
import { addBlog, deleteBlog, getAllBlog, getBlogInfo, updateBlog } from "./src/controllers/blogs.controller";
import { addCategory, deleteCategory, getAllCategory, getCategoryInfo, updateCategory } from "./src/controllers/categories.controller";
import { addComment, deleteComment, getAllComment, getCommentInfo, updateComment } from "./src/controllers/comments.controller";

function routes(app:Express){
// login

    app.post("/api/session", createSessionhandler)
    app.delete("/api/logout", deleteSesson)
    app.get("/api/refresh",newRefreshToken)
    app.post("/api/register", userRegister)
    app.get("/api/github/callback", gitCallBack.githubCallBack)
    app.patch("/api/resetotp",sendOtp)
    app.patch("/api/invalidateOtp", invalidateOtp)
    app.patch("/api/resetpassword",resetPassword)
    app.get('/api/user/confirm',  verifyUserRegistration)
    app.get("/api/user/:id", AuthenticateUser, getUserInfo)
    
    // Blogs
    app.post("/api/blog/add", AuthenticateUser, addBlog)
    app.delete("/api/blog/delete/:id", AuthenticateUser, deleteBlog)
    app.patch("/api/blog/update/:id", AuthenticateUser, updateBlog)
    app.get("/api/blog/getone/:id", AuthenticateUser, getBlogInfo)
    app.get("/api/blog/getall", getAllBlog)

     // Categories
     app.post("/api/category/add", AuthenticateUser, addCategory)
     app.delete("/api/category/delete/:id", AuthenticateUser, deleteCategory)
     app.patch("/api/category/update/:id", AuthenticateUser, updateCategory)
     app.get("/api/category/getone/:id", AuthenticateUser, getCategoryInfo)
     app.get("/api/category/getAll", getAllCategory)
     
     // Comments
     app.post("/api/comments/add", AuthenticateUser, addComment)
     app.delete("/api/comments/delete/:id", AuthenticateUser, deleteComment)
     app.patch("/api/comments/update/:id", AuthenticateUser, updateComment)
     app.get("/api/comments/getone/:id", AuthenticateUser, getCommentInfo)
     app.get("/api/comment/getall", getAllComment)
}

export default routes

module.exports = routes
module.exports.handler = ServerlessHttp(routes)
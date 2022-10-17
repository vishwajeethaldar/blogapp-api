import { Express } from "express";
import { invalidateOtp, resetPassword, sendOtp } from "./src/controllers/mail.controller";
import {createSessionhandler, deleteSesson, newRefreshToken} from './src/controllers/session.controller'
import { userRegister,welcome, verifyUserRegistration } from "./src/controllers/users.controller";
import { gitCallBack } from "./src/utils";
import ServerlessHttp from "serverless-http"
function routes(app:Express){

// login
app.get("/", welcome)
app.post("/api/session", createSessionhandler)
app.patch("/api/logout", deleteSesson)
app.patch("/api/refresh",newRefreshToken)
app.post("/api/register", userRegister)
app.get("/api/github/callback", gitCallBack.githubCallBack)
app.patch("/api/resetotp",sendOtp)
app.patch("/api/invalidateOtp", invalidateOtp)
app.patch("/api/resetpassword",resetPassword)
app.get('/api/user/confirm', verifyUserRegistration)
}

export default routes

module.exports = routes
module.exports.handler = ServerlessHttp(routes)
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_controller_1 = require("./src/controllers/mail.controller");
const session_controller_1 = require("./src/controllers/session.controller");
const users_controller_1 = require("./src/controllers/users.controller");
const utils_1 = require("./src/utils");
const serverless_http_1 = __importDefault(require("serverless-http"));
const userRequired_middleware_1 = require("./src/middleware/userRequired.middleware");
const blogs_controller_1 = require("./src/controllers/blogs.controller");
const categories_controller_1 = require("./src/controllers/categories.controller");
const comments_controller_1 = require("./src/controllers/comments.controller");
function routes(app) {
    // login
    app.post("/api/session", session_controller_1.createSessionhandler);
    app.delete("/api/logout", session_controller_1.deleteSesson);
    app.get("/api/refresh", session_controller_1.newRefreshToken);
    app.post("/api/register", users_controller_1.userRegister);
    app.get("/api/github/callback", utils_1.gitCallBack.githubCallBack);
    app.patch("/api/resetotp", mail_controller_1.sendOtp);
    app.patch("/api/invalidateOtp", mail_controller_1.invalidateOtp);
    app.patch("/api/resetpassword", mail_controller_1.resetPassword);
    app.get('/api/user/confirm', users_controller_1.verifyUserRegistration);
    app.get("/api/user/:id", userRequired_middleware_1.AuthenticateUser, users_controller_1.getUserInfo);
    // Blogs
    app.post("/api/blog/add", userRequired_middleware_1.AuthenticateUser, blogs_controller_1.addBlog);
    app.delete("/api/blog/delete/:id", userRequired_middleware_1.AuthenticateUser, blogs_controller_1.deleteBlog);
    app.patch("/api/blog/update/:id", userRequired_middleware_1.AuthenticateUser, blogs_controller_1.updateBlog);
    app.get("/api/blog/getone/:id", userRequired_middleware_1.AuthenticateUser, blogs_controller_1.getBlogInfo);
    app.get("/api/blog/getall", blogs_controller_1.getAllBlog);
    // Categories
    app.post("/api/category/add", userRequired_middleware_1.AuthenticateUser, categories_controller_1.addCategory);
    app.delete("/api/category/delete/:id", userRequired_middleware_1.AuthenticateUser, categories_controller_1.deleteCategory);
    app.patch("/api/category/update/:id", userRequired_middleware_1.AuthenticateUser, categories_controller_1.updateCategory);
    app.get("/api/category/getone/:id", userRequired_middleware_1.AuthenticateUser, categories_controller_1.getCategoryInfo);
    app.get("/api/category/getAll", categories_controller_1.getAllCategory);
    // Comments
    app.post("/api/comments/add", userRequired_middleware_1.AuthenticateUser, comments_controller_1.addComment);
    app.delete("/api/comments/delete/:id", userRequired_middleware_1.AuthenticateUser, comments_controller_1.deleteComment);
    app.patch("/api/comments/update/:id", userRequired_middleware_1.AuthenticateUser, comments_controller_1.updateComment);
    app.get("/api/comments/getone/:id", userRequired_middleware_1.AuthenticateUser, comments_controller_1.getCommentInfo);
    app.get("/api/comment/getall", comments_controller_1.getAllComment);
}
exports.default = routes;
module.exports = routes;
module.exports.handler = (0, serverless_http_1.default)(routes);

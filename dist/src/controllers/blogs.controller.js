"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBlog = exports.updateBlog = exports.getBlogInfo = exports.deleteBlog = exports.addBlog = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const addBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { accessToken } = req.cookies;
    const decoded = (_a = utils_1.jwtutils.verifyJwt(accessToken, "access")) === null || _a === void 0 ? void 0 : _a.decoded;
    try {
        if (!decoded) {
            return res.status(401).send("Session expired ");
        }
        const user = yield models_1.User.findOne({ _id: decoded === null || decoded === void 0 ? void 0 : decoded.userId });
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const nBlog = yield models_1.Blog.create(Object.assign({}, req.body));
            const newBlog = yield models_1.Blog.findOne({ _id: nBlog._id }).populate("userId", "name email role").populate("categoryId");
            return res.send(newBlog);
        }
        else {
            return res.status(401).send("As you admin for privillege");
        }
    }
    catch (e) {
        return res.status(401).send(e.message);
    }
});
exports.addBlog = addBlog;
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { accessToken } = req.cookies;
    const id = req.params.id;
    const decoded = (_b = utils_1.jwtutils.verifyJwt(accessToken, "access")) === null || _b === void 0 ? void 0 : _b.decoded;
    try {
        if (!decoded) {
            return res.status(401).send("Session expired ");
        }
        const user = yield models_1.User.findOne({ _id: decoded === null || decoded === void 0 ? void 0 : decoded.userId });
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const newBlog = yield models_1.Blog.deleteOne({ _id: id });
            return res.send("Blog Deleted Successfully");
        }
        else {
            return res.status(401).send("As you admin for privillege");
        }
    }
    catch (e) {
        return res.status(401).send(e.message);
    }
});
exports.deleteBlog = deleteBlog;
const getBlogInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { accessToken } = req.cookies;
    const id = req.params.id;
    try {
        const decoded = (_c = utils_1.jwtutils.verifyJwt(accessToken, "access")) === null || _c === void 0 ? void 0 : _c.decoded;
        if (!decoded) {
            return res.status(401).send("Session expired ");
        }
        const user = yield models_1.User.findOne({ _id: decoded === null || decoded === void 0 ? void 0 : decoded.userId });
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const existBlog = yield models_1.Blog.findOne({ _id: id });
            return res.send(existBlog);
        }
        else {
            return res.status(401).send("As you admin for privillege");
        }
    }
    catch (e) {
        return res.status(401).send(e.message);
    }
});
exports.getBlogInfo = getBlogInfo;
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    console.log(req.body);
    const { accessToken } = req.cookies;
    const id = req.params.id;
    try {
        const decoded = (_d = utils_1.jwtutils.verifyJwt(accessToken, "access")) === null || _d === void 0 ? void 0 : _d.decoded;
        if (!decoded) {
            return res.status(401).send("Session expired ");
        }
        const user = yield models_1.User.findOne({ _id: decoded === null || decoded === void 0 ? void 0 : decoded.userId });
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            yield models_1.Blog.updateOne({ _id: id }, { $set: Object.assign({}, req.body) });
            const updatedBlog = yield models_1.Blog.findOne({ _id: id });
            return res.send(updatedBlog);
        }
        else {
            return res.status(401).send("As you admin for privillege");
        }
    }
    catch (e) {
        return res.status(401).send(e.message);
    }
});
exports.updateBlog = updateBlog;
const getAllBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const { accessToken } = req.cookies;
    try {
        const decoded = (_e = utils_1.jwtutils.verifyJwt(accessToken, "access")) === null || _e === void 0 ? void 0 : _e.decoded;
        if (!decoded) {
            const bogsList = yield models_1.Blog.find({ approved: true }).populate("userId", "name email role").populate("categoryId");
            return res.send(bogsList);
        }
        const user = yield models_1.User.findOne({ _id: decoded.userId });
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const bogsList = yield models_1.Blog.find().populate("userId", "name email role").populate("categoryId");
            return res.send(bogsList);
        }
        else {
            const bogsList = yield models_1.Blog.find({ approved: true }).populate("userId", "name email role").populate("categoryId");
            return res.send(bogsList);
        }
    }
    catch (e) {
        return res.status(401).send(e.message);
    }
});
exports.getAllBlog = getAllBlog;

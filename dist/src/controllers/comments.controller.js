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
exports.updateComment = exports.getAllComment = exports.getCommentInfo = exports.deleteComment = exports.addComment = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { accessToken } = req.cookies;
    const decoded = (_a = utils_1.jwtutils.verifyJwt(accessToken, "access")) === null || _a === void 0 ? void 0 : _a.decoded;
    try {
        if (!decoded) {
            return res.status(401).send("Session expired ");
        }
        const user = yield models_1.User.findOne({ _id: decoded === null || decoded === void 0 ? void 0 : decoded.userId });
        if (user) {
            const newComment = yield models_1.Comment.create(Object.assign({}, req.body));
            return res.send(newComment);
        }
        else {
            return res.status(401).send("Sign in to Comment");
        }
    }
    catch (e) {
        return res.status(401).send(e.message);
    }
});
exports.addComment = addComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const comRes = yield models_1.Comment.deleteOne({ _id: id });
            return res.send("Comment Deleted Successfully");
        }
        else {
            return res.status(401).send("Sign in to Comment");
        }
    }
    catch (e) {
        return res.status(401).send(e.message);
    }
});
exports.deleteComment = deleteComment;
const getCommentInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { accessToken } = req.cookies;
    const id = req.params.id;
    const decoded = (_c = utils_1.jwtutils.verifyJwt(accessToken, "access")) === null || _c === void 0 ? void 0 : _c.decoded;
    try {
        if (!decoded) {
            return res.status(401).send("Session expired ");
        }
        const user = yield models_1.User.findOne({ _id: decoded === null || decoded === void 0 ? void 0 : decoded.userId });
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const existComment = yield models_1.Comment.findOne({ _id: id });
            return res.send(existComment);
        }
        else {
            return res.status(401).send("As you admin for privillege");
        }
    }
    catch (e) {
        return res.status(401).send(e.message);
    }
});
exports.getCommentInfo = getCommentInfo;
const getAllComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allComment = yield models_1.Comment.findOne({});
        return res.send(allComment);
    }
    catch (e) {
        return res.status(401).send(e.message);
    }
});
exports.getAllComment = getAllComment;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { accessToken } = req.cookies;
    const id = req.params.id;
    const decoded = (_d = utils_1.jwtutils.verifyJwt(accessToken, "access")) === null || _d === void 0 ? void 0 : _d.decoded;
    try {
        if (!decoded) {
            return res.status(401).send("Session expired ");
        }
        const user = yield models_1.User.findOne({ _id: decoded === null || decoded === void 0 ? void 0 : decoded.userId });
        if (user) {
            const existBlog = yield models_1.Comment.updateOne({ _id: id }, { $set: Object.assign({}, req.body) });
            const updatedBlog = yield models_1.Comment.findOne({ _id: id });
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
exports.updateComment = updateComment;

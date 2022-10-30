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
exports.updateCategory = exports.getAllCategory = exports.getCategoryInfo = exports.deleteCategory = exports.addCategory = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { accessToken } = req.cookies;
    const decoded = (_a = utils_1.jwtutils.verifyJwt(accessToken, "access")) === null || _a === void 0 ? void 0 : _a.decoded;
    try {
        if (!decoded) {
            return res.status(401).send("Session expired ");
        }
        const user = yield models_1.User.findOne({ _id: decoded === null || decoded === void 0 ? void 0 : decoded.userId });
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const newCategory = yield models_1.Category.create(Object.assign({}, req.body));
            return res.send(newCategory);
        }
        else {
            return res.status(401).send("As you admin for privillege");
        }
    }
    catch (e) {
        return res.status(401).send(e.message);
    }
});
exports.addCategory = addCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const deletedCategory = yield models_1.Category.deleteOne({ _id: id });
            return res.send("Category Deleted Successfully");
        }
        else {
            return res.status(401).send("As you admin for privillege");
        }
    }
    catch (e) {
        return res.status(401).send(e.message);
    }
});
exports.deleteCategory = deleteCategory;
const getCategoryInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const existCategory = yield models_1.Category.findOne({ _id: id });
            return res.send(existCategory);
        }
        else {
            return res.status(401).send("As you admin for privillege");
        }
    }
    catch (e) {
        return res.status(401).send(e.message);
    }
});
exports.getCategoryInfo = getCategoryInfo;
const getAllCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const {accessToken} = req.cookies
    // const decoded = jwtutils.verifyJwt(accessToken, "access")?.decoded as tokenData
    try {
        // if(!decoded){
        //     return res.status(401).send("Session expired ")
        // }
        // const user = await User.findOne({_id:decoded?.userId})
        // if(user?.role==="admin"){
        //     const categories = await Category.find({}) 
        //     return res.send(categories)
        // }else{
        //     return res.status(401).send("As you admin for privillege")
        // }
        const categories = yield models_1.Category.find({});
        return res.send(categories);
    }
    catch (e) {
        return res.status(401).send(e.message);
    }
});
exports.getAllCategory = getAllCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { accessToken } = req.cookies;
    const id = req.params.id;
    const decoded = (_d = utils_1.jwtutils.verifyJwt(accessToken, "access")) === null || _d === void 0 ? void 0 : _d.decoded;
    try {
        if (!decoded) {
            return res.status(401).send("Session expired ");
        }
        const cat_name = yield models_1.Category.findOne({ name: req.body.name });
        if (cat_name) {
            return res.status(500).send("Alredy Exists");
        }
        const user = yield models_1.User.findOne({ _id: decoded === null || decoded === void 0 ? void 0 : decoded.userId });
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const existBlog = yield models_1.Category.updateOne({ _id: id }, { $set: Object.assign({}, req.body) });
            const updateBlog = yield models_1.Category.findOne({ _id: id });
            return res.send(updateBlog);
        }
        else {
            return res.status(401).send("As you admin for privillege");
        }
    }
    catch (e) {
        return res.status(401).send(e.message);
    }
});
exports.updateCategory = updateCategory;

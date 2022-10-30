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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubCallBack = void 0;
const providers_1 = require("../providers");
const axios_1 = __importDefault(require("axios"));
const models_1 = require("../models");
const utils_1 = require("../utils");
const argon2Utils_1 = require("./argon2Utils");
const githubCallBack = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let token = req.query.code;
    try {
        let data = yield axios_1.default.post(`https://github.com/login/oauth/access_token`, {
            client_id: (0, providers_1.config)().GITCLIEND_ID,
            client_secret: (0, providers_1.config)().GIT_CLIENT_SECRET,
            code: token,
            header: {
                Accept: 'application/json'
            }
        });
        let accessKey = (_a = data.data) === null || _a === void 0 ? void 0 : _a.split("&")[0].split("=")[1];
        let user = yield axios_1.default.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessKey}`
            }
        });
        let existUser = yield models_1.User.findOne({ email: (_b = user.data) === null || _b === void 0 ? void 0 : _b.email });
        let tokens = {
            accessToken: "",
            refreshToken: ""
        };
        if (!existUser) {
            let hashedPwd = yield (0, argon2Utils_1.hashPassword)((0, providers_1.config)().DEFAULTPASSCODE);
            let newUser = yield models_1.User.create({ name: user.data.name, email: user.data.email, passowrd: hashedPwd });
            tokens.accessToken = utils_1.jwtutils.singJwt({ userId: newUser._id }, '2m', "access");
            tokens.refreshToken = utils_1.jwtutils.singJwt({ userId: newUser._id, xyz: "xyz" }, '30d', "refresh");
        }
        else {
            tokens.accessToken = utils_1.jwtutils.singJwt({ userId: existUser._id, role: existUser.role }, '2m', "access");
            tokens.refreshToken = utils_1.jwtutils.singJwt({ userId: existUser._id, role: existUser.role }, '30d', "refresh");
        }
        res.cookie("accessToken", tokens.accessToken, {
            maxAge: 120000,
            httpOnly: true
        });
        console.log(tokens.refreshToken);
        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: 3.154e+10,
            httpOnly: true
        });
        res.redirect(`http://localhost:5173/login/git/callback`);
        // res.send(tokens.AT)
    }
    catch (e) {
        res.send(e.message);
    }
});
exports.githubCallBack = githubCallBack;

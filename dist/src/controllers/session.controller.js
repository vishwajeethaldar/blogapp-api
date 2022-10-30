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
exports.newRefreshToken = exports.deleteSesson = exports.createSessionhandler = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const models_2 = require("../models");
const argon2Utils_1 = require("../utils/argon2Utils");
// login handler
function createSessionhandler(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const user = yield models_1.User.findOne({ email: email });
            if (user) {
                if (!(yield (0, argon2Utils_1.verifyHashedPassword)(user.password, password))) {
                    return res.send("incorrect password");
                }
                const accessToken = utils_1.jwtutils.singJwt({ userId: user._id, role: user.role }, '2m', "access");
                const refreshToken = utils_1.jwtutils.singJwt({ userId: user._id, role: user.role }, '30d', "refresh");
                res.cookie("accessToken", accessToken, {
                    maxAge: 120000,
                    httpOnly: true
                });
                res.cookie("refreshToken", refreshToken, {
                    maxAge: 2.628e+9,
                    httpOnly: true
                });
                let decodedToken = (_a = utils_1.jwtutils.verifyJwt(accessToken, "access")) === null || _a === void 0 ? void 0 : _a.decoded;
                return res.send(Object.assign({}, decodedToken));
            }
            else {
                return res.status(401).send("User does not exists");
            }
        }
        catch (e) {
            return res.status(401).send(e.message);
        }
    });
}
exports.createSessionhandler = createSessionhandler;
// Delete Session Logout
function deleteSesson(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { refreshToken, accessToken } = req.cookies;
        if (refreshToken === undefined) {
            return res.send("No session found");
        }
        try {
            yield models_2.Session.deleteOne({ _id: refreshToken._id });
            res.cookie("refreshToken", "", {
                maxAge: 0,
                httpOnly: true
            });
            res.cookie("accessToken", "", {
                maxAge: 0,
                httpOnly: true
            });
            return res.send({ status: "success" });
        }
        catch (e) {
            return res.status(401).send(e.message);
        }
    });
}
exports.deleteSesson = deleteSesson;
// New Refresh Token
function newRefreshToken(req, res) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const { refreshToken, accessToken } = req.cookies;
        try {
            if (accessToken !== undefined) {
                const validSession = (_a = utils_1.jwtutils.verifyJwt(accessToken, "access")) === null || _a === void 0 ? void 0 : _a.decoded;
                return res.send(Object.assign({}, validSession));
            }
            if (!refreshToken) {
                return res.status(400).send("Invalid Session Login Again");
            }
            const decodedSession = (_b = utils_1.jwtutils.verifyJwt(refreshToken, "refresh")) === null || _b === void 0 ? void 0 : _b.decoded;
            if (!decodedSession) {
                return res.status(401).send("Invalid Session Login Again");
            }
            const Token = utils_1.jwtutils.singJwt({ userId: decodedSession.userId, role: decodedSession.role }, '2m', "access");
            res.cookie("accessToken", Token, {
                maxAge: 120000,
                httpOnly: true
            });
            const decoded = (_c = utils_1.jwtutils.verifyJwt(Token, "access")) === null || _c === void 0 ? void 0 : _c.decoded;
            console.log(decodedSession, decoded, "refrfesh");
            return res.send(Object.assign({}, decoded));
        }
        catch (e) {
            return res.status(401).send("Invalid Session Login Again");
        }
    });
}
exports.newRefreshToken = newRefreshToken;

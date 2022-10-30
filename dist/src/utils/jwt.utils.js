"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.singJwt = void 0;
const providers_1 = require("../providers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// sign jwt
function singJwt(payload, expiresIn, kind) {
    if (kind === "access") {
        let token = jsonwebtoken_1.default.sign(payload, (0, providers_1.config)().privateKey, { expiresIn: expiresIn });
        return token;
    }
    else {
        let token = jsonwebtoken_1.default.sign(payload, (0, providers_1.config)().publicKey, { expiresIn: expiresIn });
        return token;
    }
}
exports.singJwt = singJwt;
// verify jwt
function verifyJwt(token, kind) {
    try {
        if (kind === "access") {
            let decoded = jsonwebtoken_1.default.verify(token, (0, providers_1.config)().privateKey);
            return { decoded };
        }
        if (kind === "refresh") {
            let decoded = jsonwebtoken_1.default.verify(token, (0, providers_1.config)().publicKey);
            return ({ decoded });
        }
    }
    catch (error) {
        return { payload: null, expired: error.message };
    }
}
exports.verifyJwt = verifyJwt;
/*
jwt exp time check
if (Date.now() >= exp * 1000) {
  return false;
}
*/ 

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
exports.createSession = exports.invalidateSession = exports.getSession = void 0;
const models_1 = require("../models");
const _1 = require(".");
const getSession = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let session = yield models_1.Session.findById(sessionId);
        if (session) {
            return session.active ? session.token : null;
        }
    }
    catch (e) {
        return e.message;
    }
});
exports.getSession = getSession;
const invalidateSession = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let session = yield models_1.Session.findById(sessionId);
        if (session) {
            yield models_1.Session.findOneAndUpdate({ _id: sessionId }, { $set: { active: false } });
            let invalidSession = yield models_1.Session.findById(sessionId);
            return invalidSession;
        }
    }
    catch (e) {
        return e.message;
    }
});
exports.invalidateSession = invalidateSession;
const createSession = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = _1.jwtutils.singJwt({ userId: userId }, '1h', "access");
        const refreshToken = _1.jwtutils.singJwt({ userId: userId }, '30d', "refresh");
        // const AT = await Session.create({userId:userId, token:accessToken, kind:"access", active:true})             
        const RT = yield models_1.Session.create({ userId: userId, token: accessToken, kind: "refresh", active: true });
        return { AT: accessToken, RT: RT };
    }
    catch (e) {
        return e.message;
    }
});
exports.createSession = createSession;

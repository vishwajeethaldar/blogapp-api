"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = () => {
    const mongoosedb = process.env.MONGOOSEDB || "";
    const publicKey = process.env.PUBLICKEY || "";
    const privateKey = process.env.PRIVATEKEY || "";
    const GITCLIEND_ID = process.env.GITCLIEND_ID;
    const GIT_CLIENT_SECRET = process.env.GIT_CLIENT_SECRET;
    const DEFAULTPASSCODE = process.env.DEFAULTPASSCODE || "";
    const DEFAULTURL = process.env.DEFAULTURL;
    const Z_Mail = process.env.Z_Mail;
    const Z_Mail_Pass = process.env.Z_Mail_Pass;
    const Z_Mail_Host = process.env.Z_Mail_Host;
    const Z_Mail_Port = process.env.Z_Mail_Port;
    const Z_Sec_Type = process.env.Z_Sec_Type;
    return {
        mongoosedb,
        publicKey,
        privateKey,
        GITCLIEND_ID,
        GIT_CLIENT_SECRET,
        DEFAULTPASSCODE,
        DEFAULTURL,
        Z_Mail_Pass,
        Z_Mail_Host,
        Z_Mail_Port,
        Z_Sec_Type,
        Z_Mail
    };
};
exports.default = config;

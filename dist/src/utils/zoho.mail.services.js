"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Z_Mail_Transport = void 0;
const nodemailer = require("nodemailer");
const providers_1 = require("../providers");
exports.Z_Mail_Transport = nodemailer.createTransport({
    host: (0, providers_1.config)().Z_Mail_Host,
    port: (0, providers_1.config)().Z_Mail_Port,
    secure: false,
    auth: {
        user: (0, providers_1.config)().Z_Mail,
        pass: (0, providers_1.config)().Z_Mail_Pass
    }
});

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
exports.resetPassword = exports.invalidateOtp = exports.sendOtp = void 0;
const models_1 = require("../models");
const providers_1 = require("../providers");
const utils_1 = require("../utils");
const argon2Utils_1 = require("../utils/argon2Utils");
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, subject } = req.body;
    let otp = Math.floor(Math.random() * (999999 - 111111) + 111111);
    try {
        const user = yield models_1.User.findOne({ email: email });
        if (user) {
            let zmailRes = yield utils_1.ZohoMail.Z_Mail_Transport.sendMail({
                to: email,
                from: (0, providers_1.config)().Z_Mail,
                subject: subject,
                text: `OTP to Verify Your accoutn is ${otp}`
            });
            let updatedOtp = yield models_1.User.updateOne({ email: email }, { $set: { otp: otp.toString() } });
            console.log(updatedOtp);
            return res.send({ status: "success", responce: "email send successfully" });
        }
        else {
            res.status(401).send("Email Not Exists");
        }
    }
    catch (e) {
        return res.send(e.message);
    }
});
exports.sendOtp = sendOtp;
const invalidateOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        yield models_1.User.findOneAndUpdate({ email: email }, { $set: { otp: "" } });
        res.send("OTP Expired");
    }
    catch (e) {
        res.send(e.message);
    }
});
exports.invalidateOtp = invalidateOtp;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newPassword } = req.body;
    try {
        let hashedpassword = yield (0, argon2Utils_1.hashPassword)(newPassword);
        let userforPReset = yield models_1.User.findOne({ email: email });
        if (userforPReset) {
            console.log(userforPReset, "otp" + otp);
            console.log(req.body);
            if (userforPReset.otp !== otp) {
                return res.send("Incorrect OTP");
            }
            else {
                yield models_1.User.findOneAndUpdate({ email: email }, { $set: { otp: "", password: hashedpassword } });
                return res.send({ status: "success", msg: "Password Changes Sucessfully" });
            }
        }
        else {
            return res.send("Incorect email");
        }
    }
    catch (e) {
        return res.send(e.message);
    }
});
exports.resetPassword = resetPassword;

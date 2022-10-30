"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    otp: String,
    role: { type: String, default: "user" }
});
const tempUser = mongoose_1.default.model('tempuser', userSchema);
exports.default = tempUser;

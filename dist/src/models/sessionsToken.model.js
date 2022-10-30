"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sessionSchema = new mongoose_1.default.Schema({
    kind: { type: String, enum: ["access", "refresh"] },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "user" },
    token: { type: String },
    active: { type: Boolean },
});
const Session = mongoose_1.default.model("session", sessionSchema);
exports.default = Session;

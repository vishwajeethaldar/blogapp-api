"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const blacklistedSchema = new mongoose_1.default.Schema({
    kind: { type: String },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "user" },
    token: { type: String },
    active: { type: Boolean },
});
const blacklisted = mongoose_1.default.model("blacklisted", blacklistedSchema);
exports.default = blacklisted;

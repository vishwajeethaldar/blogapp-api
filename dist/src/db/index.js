"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
var config_1 = require("./config");
Object.defineProperty(exports, "dbConnect", { enumerable: true, get: function () { return __importDefault(config_1).default; } });

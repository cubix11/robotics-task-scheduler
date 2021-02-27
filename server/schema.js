"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomName = exports.schemaSignup = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginSchema = joi_1.default.object().keys({
    username: joi_1.default.string().trim().regex(/(^[a-zA-Z0-9_]*$)/).min(2).max(30).required(),
    password: joi_1.default.string().trim().regex(/(^[a-zA-Z0-9!@#$%^&*()_+]*$)/).min(8).required()
});
exports.schemaSignup = joi_1.default.object().keys({
    username: joi_1.default.string().trim().regex(/(^[a-zA-Z0-9_]*$)/).min(2).max(30).required(),
    email: joi_1.default.string().trim().required().email(),
    password: joi_1.default.string().trim().regex(/(^[a-zA-Z0-9!@#$%^&*()_+]*$)/).min(8).required()
});
exports.roomName = joi_1.default.object().keys({
    name: joi_1.default.string().trim().regex(/(^[-a-zA-Z0-9_ ]*$)/).max(30).required()
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskSchema = exports.roomName = exports.signupSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const joi_objectid_1 = __importDefault(require("joi-objectid"));
joi_1.default.objectId = joi_objectid_1.default(joi_1.default);
exports.loginSchema = joi_1.default.object().keys({
    username: joi_1.default.string().trim().regex(/(^[a-zA-Z0-9_]*$)/).min(2).max(30).required(),
    password: joi_1.default.string().trim().regex(/(^[a-zA-Z0-9!@#$%^&*()_+]*$)/).min(8).required()
});
exports.signupSchema = joi_1.default.object().keys({
    username: joi_1.default.string().trim().regex(/(^[a-zA-Z0-9_]*$)/).min(2).max(30).required(),
    email: joi_1.default.string().trim().required().email(),
    password: joi_1.default.string().trim().regex(/(^[a-zA-Z0-9!@#$%^&*()_+]*$)/).min(8).required()
});
exports.roomName = joi_1.default.object().keys({
    name: joi_1.default.string().trim().regex(/(^[-a-zA-Z0-9_ ]*$)/).max(30).required()
});
exports.taskSchema = joi_1.default.object().keys({
    name: joi_1.default.string().trim().required(),
    roomid: joi_1.default.objectId().trim().required()
});

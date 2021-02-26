"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object().keys({
    username: joi_1.default.string().trim().regex(/(^[a-zA-Z0-9_]*$)/).min(2).max(30).required(),
    password: joi_1.default.string().trim().regex(/(^[a-zA-Z0-9!@#$%^&*()_+]*$)/).min(8).required()
});
exports.default = schema;

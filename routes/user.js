"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schema_1 = __importDefault(require("../schema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.Router();
router.post('/signup', async (req, res, next) => {
    const user = req.body;
    const valid = schema_1.default.validate(user);
    if (valid.error) {
        res.statusCode = 400;
        return next(new Error(valid.error.details[0].message));
    }
    ;
    if (await User_1.default.findOne({ username: user.username })) {
        res.statusCode = 409;
        return next(new Error('Already user with that username'));
    }
    ;
    const hashedPassword = await bcrypt_1.default.hash(user.password, 15);
    await new User_1.default({
        username: user.username,
        password: hashedPassword
    }).save();
});
exports.default = router;

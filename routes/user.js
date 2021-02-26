"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schema_1 = require("../schema");
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.Router();
router.post('/signup', async (req, res, next) => {
    const userinput = req.body;
    const valid = schema_1.schemaSignup.validate(userinput);
    if (valid.error) {
        res.statusCode = 400;
        return next(new Error(valid.error.details[0].message));
    }
    ;
    if (await User_1.default.findOne({ username: userinput.username })) {
        res.statusCode = 409;
        return next(new Error('Already user with that username'));
    }
    ;
    const hashedPassword = await bcrypt_1.default.hash(userinput.password, 15);
    const user = new User_1.default({
        username: userinput.username,
        email: userinput.email,
        password: hashedPassword
    });
    const insertedUser = await user.save();
    res.status(201).json(insertedUser);
});
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schema_1 = require("../schema");
const User_1 = __importDefault(require("../models/User"));
const string_encode_decode_1 = require("string-encode-decode");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("../dotenv"));
const router = express_1.Router();
function getToken(username, res, next) {
    jsonwebtoken_1.default.sign({ username }, dotenv_1.default.SECRET_TOKEN, {
        expiresIn: 15
    }, (err, token) => {
        if (err) {
            return next(new Error('Sorry, something went to wrong'));
        }
        ;
        res.json({ token });
    });
}
;
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
    getToken(userinput.username, res, next);
    const hashedPassword = await bcrypt_1.default.hash(userinput.password, 15);
    const user = new User_1.default({
        username: userinput.username,
        email: string_encode_decode_1.encode(userinput.email),
        password: hashedPassword
    });
    user.save();
});
exports.default = router;

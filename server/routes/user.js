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
const functions_1 = require("../functions");
const router = express_1.Router();
const SALT_ROUNDS = parseInt(dotenv_1.default.SALT_ROUNDS);
const URL = process.env.NODE_ENV ? '' : 'http://localhost:3000';
function getToken(username, res, next) {
    jsonwebtoken_1.default.sign({ username }, dotenv_1.default.SECRET_TOKEN, {
        expiresIn: '1h'
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
    const valid = schema_1.signupSchema.validate(userinput);
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
    const hashedPassword = await bcrypt_1.default.hash(userinput.password, SALT_ROUNDS);
    const user = new User_1.default({
        username: userinput.username,
        email: string_encode_decode_1.encode(userinput.email),
        password: hashedPassword
    });
    await user.save();
});
router.post('/login', async (req, res, next) => {
    const user = req.body;
    console.log(user);
    const valid = schema_1.loginSchema.validate(user);
    if (valid.error) {
        res.statusCode = 400;
        return next(new Error(valid.error.details[0].message));
    }
    ;
    if (await functions_1.checkPassword(user.username, user.password, res, next))
        getToken(user.username, res, next);
});
router.patch('/update', functions_1.checkUser, async (req, res, next) => {
    const username = req.username;
    const updates = req.body;
    const password = req.body.password;
    delete updates.password;
    if (await functions_1.checkPassword(username, password, res, next)) {
        if (updates.newPassword) {
            updates.password = await bcrypt_1.default.hash(updates.newPassword, SALT_ROUNDS);
            delete updates.newPassword;
        }
        ;
        if (updates.email)
            updates.email = string_encode_decode_1.encode(updates.email);
        if (updates.username) {
            res.statusCode = 202;
            getToken(updates.username, res, next);
        }
        else {
            res.statusCode = 204;
            res.end();
        }
        ;
        await User_1.default.updateOne({ username: username }, updates);
    }
    else {
        res.statusCode = 403;
        return next(new Error('Password is incorrect'));
    }
    ;
});
router.delete('/delete', functions_1.checkUser, async (req, res, next) => {
    const username = req.username;
    const password = req.body.password;
    if (await functions_1.checkPassword(username, password, res, next)) {
        await User_1.default.deleteOne({ username });
        res.status(204).end();
    }
    ;
});
router.post('/room/join', functions_1.checkUser, async (req, res) => {
    const username = req.username;
    await User_1.default.updateOne({ username }, { roomid: req.query.id });
    res.status(204).end();
});
router.post('/forgot', async (req, res, next) => {
    const username = req.body.username;
    const user = await User_1.default.findOne({ username });
    if (!user) {
        res.statusCode = 404;
        return next(new Error('User not found'));
    }
    ;
    res.json({ username: string_encode_decode_1.encode(username) });
    const html = `Go to this <a href="${URL}/reset">link</a> to reset password`;
    functions_1.sendMail(string_encode_decode_1.decode(user.email), 'Password Reset', html);
});
router.post('/reset', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const emailUsername = string_encode_decode_1.decode(req.body.email);
    if (emailUsername !== username) {
        res.statusCode = 403;
        return next(new Error('Username is not correct, so you cannot change the password'));
    }
    ;
    const user = await User_1.default.findOne({ username });
    const valid = schema_1.loginSchema.validate({ username, password });
    console.log(valid);
    if (valid.error) {
        res.statusCode = 400;
        return next(new Error(valid.error.details[0].message));
    }
    ;
    if (!user) {
        res.statusCode = 404;
        return next(new Error('User not found'));
    }
    ;
    const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
    await User_1.default.updateOne({ username }, { password: hashedPassword });
    res.status(204).end();
});
exports.default = router;

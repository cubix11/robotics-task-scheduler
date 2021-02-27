"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPassword = exports.checkUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("./dotenv"));
const User_1 = __importDefault(require("./models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const schema_1 = require("./schema");
function checkUser(req, res, next) {
    let token = req.get('Authorization');
    if (token) {
        token = token.split(' ')[1];
        jsonwebtoken_1.default.verify(token, dotenv_1.default.SECRET_TOKEN, (err, token) => {
            if (err) {
                const error = new Error('Unauthorized');
                res.status(401).json({ error: error.message });
                return;
            }
            ;
            req.username = token.username;
            next();
        });
    }
    else {
        const error = new Error('Unauthorized');
        res.status(401).json({ error: error.message });
    }
    ;
}
exports.checkUser = checkUser;
;
async function checkPassword(username, password, res, next) {
    const valid = schema_1.loginSchema.validate({ username, password });
    if (valid.error) {
        res.statusCode = 400;
        next(new Error(valid.error.details[0].message));
        return false;
    }
    ;
    const dbUser = await User_1.default.findOne({ username });
    if (!dbUser) {
        res.statusCode = 404;
        next(new Error('No user with username'));
        return false;
    }
    ;
    const dbPassword = dbUser.password;
    console.log(password);
    const correct = await bcrypt_1.default.compare(password, dbPassword);
    console.log(correct);
    if (!correct) {
        res.statusCode = 403;
        next(new Error('Password is incorrect'));
        return false;
    }
    else {
        return true;
    }
    ;
}
exports.checkPassword = checkPassword;
;

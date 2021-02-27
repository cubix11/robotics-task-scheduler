"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("./dotenv"));
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

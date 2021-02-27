"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const user_1 = __importDefault(require("./routes/user"));
const room_1 = __importDefault(require("./routes/room"));
db_1.default;
const app = express_1.default();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use('/user', user_1.default);
app.use('/room', room_1.default);
app.use(errorHandler);
function errorHandler(error, req, res, next) {
    res.statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const response = {
        message: error.message
    };
    if (!process.env.NODE_ENV)
        response.stack = error.stack;
    res.json(response);
}
;
app.listen(PORT, () => console.log('Listening on port', PORT));

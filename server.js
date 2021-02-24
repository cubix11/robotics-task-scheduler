"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const user_1 = __importDefault(require("./routes/user"));
db_1.default;
const app = express_1.default();
const PORT = process.env.PORT || 3000;
app.use(user_1.default);
app.listen(PORT, () => console.log('Listening on port', PORT));

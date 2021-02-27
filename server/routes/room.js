"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schema_1 = require("../schema");
const Room_1 = __importDefault(require("../models/Room"));
const router = express_1.Router();
router.post('/create', async (req, res, next) => {
    const name = req.body.name;
    const valid = schema_1.roomName.validate({ name });
    if (valid.error) {
        res.statusCode = 400;
        return next(new Error(valid.error.details[0].message));
    }
    ;
    const user = await (new Room_1.default({ name })).save();
    res.statusCode = 202;
    res.json({ id: user._id });
});
router.delete('/delete', async (req, res, next) => {
    const id = req.body.id;
    if (!(await Room_1.default.findById(id))) {
        res.statusCode = 404;
        return next(new Error('Room id not found'));
    }
    ;
    await Room_1.default.findByIdAndDelete(id);
    res.status(204).end();
});
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Task_1 = __importDefault(require("../models/Task"));
const schema_1 = require("../schema");
const router = express_1.Router();
router.post('/create', async (req, res, next) => {
    const task = req.body;
    const valid = schema_1.taskSchema.validate(task);
    if (valid.error) {
        res.statusCode = 400;
        return next(new Error(valid.error.details[0].message));
    }
    ;
    await (new Task_1.default({
        name: task.name,
        roomid: task.roomid
    })).save();
    res.status(204).end();
});
//router.patch('/edit', (req: Request, res: Response, next: NextFunction): Promise<void> => {})
exports.default = router;

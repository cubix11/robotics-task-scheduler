import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import Task from '../models/Task';
import { taskSchema } from '../schema';
import { TaskInput } from '../types';

const router: Router = Router();

router.post('/create', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const task: TaskInput = req.body;
    const valid: Joi.ValidationResult = taskSchema.validate(task);
    if(valid.error) {
        res.statusCode = 400;
        return next(new Error(valid.error.details[0].message));
    };
    await (
        new Task({
            name: task.name,
            roomid: task.roomid
        })
    ).save();
    res.status(204).end();
});

//router.patch('/edit', (req: Request, res: Response, next: NextFunction): Promise<void> => {})

export default router;
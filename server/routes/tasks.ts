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

router.patch('/edit', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id: string = req.query.id;
    const newName: string = req.body.name;
    const valid: Joi.ValidationResult = taskSchema.validate({ roomid: id, name: newName });
    if(valid.error) {
        res.statusCode = 400;
        return next(new Error(valid.error.details[0].message));
    };
    await Task.findByIdAndUpdate(id, { name: newName });
    res.status(204).end();
})

router.delete('/delete', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.query.id;
    console.log(id)
    const valid: Joi.ValidationResult = taskSchema.validate({ roomid: id, name: 'test' });
    if(valid.error) {
        res.statusCode = 400;
        return next(new Error(valid.error.details[0].message));
    };
    await Task.findByIdAndDelete(id);
    res.status(204).end();
});

export default router;
import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { roomName } from '../schema';
import Room from '../models/Room';
import User from '../models/User';
import Task from '../models/Task';

const router: Router = Router();

router.post('/create', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const name: string = req.body.name;
    const valid: Joi.ValidationResult = roomName.validate({ name });
    if(valid.error) {
        res.statusCode = 400;
        return next(new Error(valid.error.details[0].message));
    };
    const user = await (new Room({ name })).save();
    res.statusCode = 201;
    res.json({ id: user._id });
});

router.delete('/delete', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id: string = req.query.id;
    if(!(await Room.findById(id))) {
        res.statusCode = 404;
        return next(new Error('Room id not found'));
    };
    await Room.findByIdAndDelete(id);
    res.status(204).end();
});

router.get('/data', async (req: Request, res: Response): Promise<void> => {
    const roomid: string = req.query.id;
    const users = (await User.find({ roomid })).map(user => user.username);
    const tasks = (await Task.find({ roomid })).map(room => room.name);
    res.json({ users, tasks });
});

export default router;
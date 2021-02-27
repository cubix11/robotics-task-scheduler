import e, { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { roomName } from '../schema';
import Room from '../models/Room';
import User from '../models/User';

const router: Router = Router();

router.post('/create', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const name: string = req.body.name;
    const valid: Joi.ValidationResult = roomName.validate({ name });
    if(valid.error) {
        res.statusCode = 400;
        return next(new Error(valid.error.details[0].message));
    };
    const user = await (new Room({ name })).save();
    res.statusCode = 202;
    res.json({ id: user._id });
});

router.delete('/delete', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id: string = req.body.id;
    if(!(await Room.findById(id))) {
        res.statusCode = 404;
        return next(new Error('Room id not found'));
    };
    await Room.findByIdAndDelete(id);
    res.status(204).end();
});

export default router;
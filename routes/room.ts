import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { roomName } from '../schema';
import Room from '../models/Room';

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

export default router;
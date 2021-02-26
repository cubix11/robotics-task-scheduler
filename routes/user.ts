import { NextFunction, Request, Response, Router } from 'express';
import schema from '../schema';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import { UserInput } from '../types';
import User from '../models/User';

const router: Router = Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user: UserInput = req.body;
    const valid: Joi.ValidationResult = schema.validate(user);
    if(valid.error) {
        res.statusCode = 400;
        return next(new Error(valid.error.details[0].message));
    };
    if(await User.findOne({ username: user.username })) {
        res.statusCode = 409;
        return next(new Error('Already user with that username'));
    };
    const hashedPassword = await bcrypt.hash(user.password, 15);
    await new User({
        username: user.username,
        password: hashedPassword
    }).save();
});

export default router;
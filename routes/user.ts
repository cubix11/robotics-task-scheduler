import { Router, Request, Response, NextFunction } from 'express';
import { UserInput } from '../types';
import { schemaSignup, loginSchema } from '../schema';
import Joi from 'joi';
import User from '../models/User';
import { encode } from 'string-encode-decode';
import bcrypt from 'bcrypt';

const router: Router = Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userinput: UserInput = req.body;
    const valid: Joi.ValidationResult = schemaSignup.validate(userinput);
    if(valid.error) {
        res.statusCode = 400;
        return next(new Error(valid.error.details[0].message));
    };
    if(await User.findOne({ username: userinput.username })) {
        res.statusCode = 409;
        return next(new Error('Already user with that username'));
    };
    const hashedPassword = await bcrypt.hash(userinput.password, 15);
    const user = new User({
        username: userinput.username,
        email: userinput.email,
        password: hashedPassword
    });
    const insertedUser = await user.save();
    res.status(201).json(insertedUser);
});

export default router;
import { Router, Request, Response, NextFunction } from 'express';
import { Updates, UserInput } from '../types';
import { schemaSignup, loginSchema } from '../schema';
import Joi from 'joi';
import User from '../models/User';
import { encode } from 'string-encode-decode';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../dotenv';
import { checkUser } from '../functions';

const router: Router = Router();

function getToken(username: string, res: Response, next: NextFunction): void {
    jwt.sign(
        { username },
        env.SECRET_TOKEN!,
        {
            expiresIn: '5m'
        },
        (err: Error | null, token: string | undefined): void => {
            if(err) {
                return next(new Error('Sorry, something went to wrong'));
            };
            res.json({ token });
        }
    );
};

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
    getToken(userinput.username, res, next);
    const hashedPassword = await bcrypt.hash(userinput.password, 15);
    const user = new User({
        username: userinput.username,
        email: encode(userinput.email),
        password: hashedPassword
    });
    user.save();
});

router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user: UserInput = req.body;
    const valid = loginSchema.validate(user);
    if(valid.error) {
        res.statusCode = 400;
        return next(new Error(valid.error.details[0].message));
    };
    const dbUser = await User.findOne({ username: user.username })
    if(!dbUser) {
        res.statusCode = 404;
        return next(new Error('No user with username'));
    };
    const password: string = dbUser.password;
    const correct: boolean = await bcrypt.compare(user.password, password);
    if(correct) {
        getToken(user.username, res, next);
    } else {
        res.statusCode = 403;
        next(new Error('Password is incorrect'));
    };
});

router.patch('/update', checkUser, (req: Request, res: Response, next: NextFunction): void => {
    const username: string = req.username;
    const updates: Updates = req.body;
    const password = req.body.password;
    delete updates.password;
    
});

export default router;
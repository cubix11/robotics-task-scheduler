import { Router, Request, Response, NextFunction } from 'express';
import { Updates, UserInput } from '../types';
import { schemaSignup, loginSchema } from '../schema';
import Joi from 'joi';
import User from '../models/User';
import { encode } from 'string-encode-decode';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../dotenv';
import { checkUser, checkPassword } from '../functions';

const router: Router = Router();
const SALT_ROUNDS: number = parseInt(env.SALT_ROUNDS!);

function getToken(username: string, res: Response, next: NextFunction): void {
    jwt.sign(
        { username },
        env.SECRET_TOKEN!,
        {
            expiresIn: '1h'
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
    if(await User.findOne({ username: userinput.username })) {
        res.statusCode = 409;
        return next(new Error('Already user with that username'));
    };
    getToken(userinput.username, res, next);
    const hashedPassword = await bcrypt.hash(userinput.password, SALT_ROUNDS);
    const user = new User({
        username: userinput.username,
        email: encode(userinput.email),
        password: hashedPassword
    });
    await user.save();
});

router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user: UserInput = req.body;
    const valid = loginSchema.validate(user);
    if(valid.error) {
        res.statusCode = 400;
        return next(new Error(valid.error.details[0].message));
    };
    if(await checkPassword(user.username, user.password, res, next)) getToken(user.username, res, next);
});

router.patch('/update', checkUser, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const username: string = req.username;
    const updates: Updates = req.body;
    const password = req.body.password;
    delete updates.password;
    if(await checkPassword(username, password, res, next)) {
        if(updates.newPassword) {
            updates.password = await bcrypt.hash(updates.newPassword, SALT_ROUNDS);
            delete updates.newPassword;
        };
        if(updates.email) updates.email = encode(updates.email);
        if(updates.username) {
            res.statusCode = 202;
            getToken(updates.username, res, next);
        } else {
            res.statusCode = 204;
            res.end();
        };
        await User.updateOne({ username: username }, updates);
    } else {
        res.statusCode = 403;
        return next(new Error('Password is incorrect'));
    };
});

router.delete('/delete', checkUser, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const username: string = req.username;
    const password: string = req.body.password;
    if(await checkPassword(username, password, res, next)) {
        await User.deleteOne({ username });
        res.status(204).end();
    };
});

export default router;
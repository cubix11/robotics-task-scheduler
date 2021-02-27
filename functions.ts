import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import env from './dotenv';
import User from './models/User';
import bcrypt from 'bcrypt';
import { loginSchema } from './schema';
import Joi from 'joi';
import { SendEmailOptions } from './types';
import sendgrid from '@sendgrid/mail';

const API_KEY: string = (process.env.NODE_ENV ? process.env.API_PROD : process.env.API_DEV)!;
sendgrid.setApiKey(API_KEY);

export function checkUser(req: Request, res: Response, next: NextFunction): void {
    let token = req.get('Authorization');
    if(token) {
        token = token.split(' ')[1];
        jwt.verify(token, env.SECRET_TOKEN!, (err: JsonWebTokenError | NotBeforeError | TokenExpiredError | null, token: object | undefined): void => {
            if(err) {
                const error: Error = new Error('Unauthorized');
                res.status(401).json({ error: error.message });
                return;
            };
            req.username = token!.username;
            next()
        });
    } else {
        const error: Error = new Error('Unauthorized');
        res.status(401).json({ error: error.message });
    };
};

export async function checkPassword(username: string, password: string, res: Response, next: NextFunction): Promise<boolean> {
    const valid: Joi.ValidationResult = loginSchema.validate({ username, password });
    if(valid.error) {
        res.statusCode = 400;
        next(new Error(valid.error.details[0].message));
        return false;
    };
    const dbUser = await User.findOne({ username })
    if(!dbUser) {
        res.statusCode = 404;
        next(new Error('No user with username'));
        return false;
    };
    const dbPassword: string = dbUser.password;
    const correct: boolean = await bcrypt.compare(password, dbPassword);
    if(!correct) {
        res.statusCode = 403;
        next(new Error('Password is incorrect'));
        return false;
    } else {
        return true;
    };
};

export function sendMail(to: string, subject: string, text: string) {
    const emailOptions: SendEmailOptions = {
        to,
        from: {
            email: 'karmakarfamily216php@gmail.com',
            name: 'Robotics Task Scheduler'
        },
        subject,
        text,
        html: text
    };
    sendgrid.send(emailOptions);
};
import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import env from './dotenv';

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
import express, { NextFunction, Request, Response } from 'express';
import db from './db';
import { ResponseError } from './types';
import router from './routes/user';
db;
const app: express.Application = express();
const PORT: number | string = process.env.PORT || 3000;

app.use(express.json());
app.use('/user', router);
app.use(errorHandler);
function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    res.statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const response: ResponseError = {
        error: error.message
    };
    if(!process.env.NODE_ENV) response.stack = error.stack;
    res.json({ error: response });
};

app.listen(PORT, (): void => console.log('Listening on port', PORT));
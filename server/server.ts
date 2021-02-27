import express, { Request, Response, NextFunction } from 'express';
import db from './db';
import userRoutes from './routes/user';
import roomRoutes from './routes/room';
import taskRoutes from './routes/tasks';
import { ResponseError } from './types';
db;
const app: express.Application = express();
const PORT: number | string = process.env.PORT || 3000;

app.use(express.json());
app.use('/user', userRoutes);
app.use('/room', roomRoutes);
app.use('/task', taskRoutes);
app.use(errorHandler);

function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    res.statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const response: ResponseError = {
        message: error.message
    };
    if(!process.env.NODE_ENV) response.stack = error.stack;
    res.json(response);
};

app.listen(PORT, (): void => console.log('Listening on port', PORT));
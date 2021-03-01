import express, { Request, Response, NextFunction } from 'express';
import db from './db';
import userRoutes from './routes/user';
import roomRoutes from './routes/room';
import taskRoutes from './routes/tasks';
import { ResponseError, TaskInput } from './types';
import socketio from 'socket.io';
import http from 'http';
import path from 'path';
import { taskSchema } from './schema';
import Joi from 'joi';
import Task from './models/Task';

db;
const app: express.Application = express();
const PORT: number | string = process.env.PORT || 3000;
const server: http.Server = http.createServer(app);
const io: socketio.Namespace = socketio(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/user', userRoutes);
app.use('/room', roomRoutes);
app.use('/task', taskRoutes);
app.use('/', (req: Request, res: Response): void => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.use(errorHandler);

function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    res.statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const response: ResponseError = {
        message: error.message
    };
    if(!process.env.NODE_ENV) response.stack = error.stack;
    res.json(response);
};

// Socket events
io.on('connection', (socket: socketio.Socket): void => {
    console.log('Client connected');
    socket.on('join-room', (id: string): void | Promise<void> => socket.join(id));
    socket.on('create-task', async (task: TaskInput): Promise<void> => {
        const valid: Joi.ValidationResult = taskSchema.validate(task);
        if(valid.error) {
            socket.emit('create-task-error', new Error(valid.error.details[0].message));
            return;
        };
        const insertedTask = await (
            new Task({
                name: task.name,
                roomid: task.roomid
            })
        ).save();
        io.to(task.roomid).emit('create-task', insertedTask._id);
    });
});

console.log('Server listening on port', PORT);
server.listen(3000)
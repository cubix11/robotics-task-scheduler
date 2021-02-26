import { string } from 'joi';
import { Document } from 'mongoose';

export interface UserSchema extends Document {
    username: string;
    password: string;
    email: string;
    roomid: string | null;
};

export interface UserInput {
    username: string;
    password: string;
    email: string;
}

export interface ResponseError {
    message: string;
    stack?: string;
}

export interface Updates {
    username?: string;
    password?: string;
    email?: string;
    newPassword?: string;
};